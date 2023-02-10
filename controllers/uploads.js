const path = require('path');
const fs = require('fs');
const cloudinary  = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );
const { response } = require("express");
const { subirArchivo } = require( '../helpers/subir-archivo' );
const { Usuario, Producto } = require( '../models');

const cargarArchivo = async (req, res = response) => {

    try{
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        res.json({ nombre })
    }
    catch(msg){
        res.status( 400 ).json({ msg });
    }
}

const actualizarImagen = async ( req, res = reponse ) => {
    const { id, coleccion } = req.params;
    try{
        let modelo;
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${ id }`
                    })
                }
                
                break;
            case 'productos':
                modelo = await Producto.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe el producto con el id ${ id }`
                    })
                }
                break;
            default:
                return res.status( 500 ).json({ msg: 'Opción no valida'});
        }

        //limpiar imágenes previas
        if( modelo.img ){
            const pathImg = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if( fs.existsSync( pathImg ) ){
                fs.unlinkSync( pathImg );
            }
        }
    
        const nombre = await subirArchivo( req.files, undefined, coleccion );
        modelo.img = nombre;
        await modelo.save();
    
        res.json({
            id, 
            coleccion
        })
    }
    catch(msg){
        res.status(500).json({ msg });
    }
}

const actualizarImagenCloudinary = async ( req, res = reponse ) => {
    const { id, coleccion } = req.params;
    try{
        let modelo;
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe usuario con el id ${ id }`
                    })
                }
                
                break;
            case 'productos':
                modelo = await Producto.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe el producto con el id ${ id }`
                    })
                }
                break;
            default:
                return res.status( 500 ).json({ msg: 'Opción no valida'});
        }

        if( modelo.img ){
            const nombreArr = modelo.img.split('/');
            const nombre    = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');

            await cloudinary.uploader.destroy( public_id );
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

        modelo.img = secure_url;
        await modelo.save();
    
        res.status(200).json({
            modelo
        })
    }
    catch(msg){
        res.status(500).json({ msg });
    }
}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    try{
        let modelo;
        switch( coleccion ){
            case 'usuarios':
                modelo = await Usuario.findById(id);
                break;
            case 'productos':
                modelo = await Producto.findById(id);
                break;
            default:
                res.status( 500 ).json({ msg: 'No se ha validado la ruta'}); 
             break;
        }
        
        if( modelo.img ){
            const imagePath = path.join( __dirname, '../uploads', coleccion, modelo.img);

            if( fs.existsSync(imagePath) ){
                res.sendFile( imagePath );
            }
            
            res.json({ ImgUrl: modelo.img } )
        }
        else{
            const imageNotFoundPath = path.join( __dirname, '../assets/imagenotfound.png');
            return res.sendFile( imageNotFoundPath );
        }
    }
    catch(msg){
        res.status(500).json({ msg });
    }
}

module.exports = {
    actualizarImagen,
    actualizarImagenCloudinary,
    cargarArchivo,
    mostrarImagen
}