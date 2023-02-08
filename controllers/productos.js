const { response } = require( 'express' );
const { Producto } = require( '../models' );

const obtenerProductos = async ( req, res = response) => {
    const { desde = 0, 
        limite = 5 } = req.query;
    const query = { estado: true }; //todos los registros activos
    try{

        const [ total, productos ] = await Promise.all([
            Producto.count( query ),
            Producto
                .find( query )
                .skip( Number( desde ))
                .limit( Number( limite ))
                .populate('usuario', 
                        'nombre', 
                        'Usuarios')
                .populate('categoria', 'nombre', 'Categoria')
        ]);
        
        let msg = '';

        if( total === 0 ){
            msg = `No se han encontrado productos registrados`;
        }
        else{
            msg = `Se han encontrado ${ total } productos`;
        }

        res.status( 200 ).json({
            msg,
            total,
            productos,
        })
    }
    catch(err){
        console.log( err );
        res.status(500).json({ msg: `Ha ocurrido un error, favor contacte al administrador`});
    }
}

const obtenerProductosID = async ( req, res = response ) =>{
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre', 'Usuarios')
        .populate( 'categoria', 'nombre', 'Categoria');

    if( !producto ){
        res.status(404).json({
            msg: `No se ha encontrado el producto con el id ${id}`
        })
    }

    res.status(200).json({
        producto
    })
}

const crearProducto = async ( req, res = response ) => {
    const { estado, usuario, ...body } = req.body;
    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if( productoDB ){
        return res.json({
            msg: `El producto ${ productoDB.nombre } ya existe`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    await producto.save();
    res.status( 200 ).json({
        producto
    })
}

const actualizarProducto = async ( req, res = response ) =>{
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    //data.categoria = req.categoria._id;

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true} );

    res.status(200).json({
        msg: `Se ha actualizado el producto ${ data.nombre }`,
        producto
    })
}

const borrarProducto = async ( req, res = response ) => {
    
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate( id, { estado: false });
    console.log( producto )

    if( !producto ){
        res.status( 200 ).json({ msg: `El producto con el id ${ id } no existe` });
    }

    res.status( 200 ).json({ msg: 'Se ha eliminado el producto' });
}

module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProductos,
    obtenerProductosID,
}