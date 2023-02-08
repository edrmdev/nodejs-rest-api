const { response } = require( 'express' );
const { Categoria, Usuario } = require( '../models' );

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async ( req, res = response) => {
    const { desde = 0, 
            limite = 5 } = req.query;
    const query = { estado: true }; //todos los registros activos
    try{

        const [ total, categorias ] = await Promise.all([
            Categoria.count( query ),
            Categoria
                .find( query )
                .skip( Number( desde ))
                .limit( Number( limite ))
                .populate('usuario', 
                          'nombre', 
                          'Usuarios')
        ]);
        
        let msg = '';
    
        if( total === 0 ){
            msg = `No se han encontrado categorias registradas`;
        }
        else{
            msg = `Se han encontrado ${ total } categorias`;
        }
    
        res.status( 200 ).json({
            msg,
            total,
            categorias,
        })
    }
    catch(err){
        console.log( err );
        res.status(500).json({ msg: `Ha ocurrido un error, favor contacte al administrador`});
    }
}

// obtenerCategoria - populate {} solo objeto
const obtenerCategoriaID = async ( req, res = response ) => {
    
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre', 'Usuarios');

    if( !categoria ){
        res.status(404).json({
            msg: `No se ha encontrado la categoria con el id ${id}`
        })
    }

    res.status(200).json({
        categoria
    })
}

const crearCategoria = async ( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ){
        return res.json( { 
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    await categoria.save();
    res.status( 200 ).json( categoria );
}

//Actualizar categoria (nombre de parametro) validar si ya existe
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true} );

    res.status(200).json({
        msg: `Se ha actualizado la categoria ${ data.nombre }`,
        categoria
    })
}

//borrarCategoria - estado: false
const borrarCategoria = async ( req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false });
    console.log( categoria )

    if( !categoria ){
        res.status( 404 ).json({ msg: `El usuario con el id ${ id } no existe` });
    }

    res.status( 200 ).json({ msg: 'Se ha eliminado la categoria' });
}

module.exports = {
    actualizarCategoria,
    borrarCategoria,
    crearCategoria,
    obtenerCategoriaID,
    obtenerCategorias,
}