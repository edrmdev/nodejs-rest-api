
const { response } = require( 'express' );
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async ( req, res = response, next ) => {

    const token = req.header( 'x-token' );

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try{

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY )
        const usuario = await Usuario.findById( uid );
        
        if ( !usuario ){
            res.status( 401 ).json({
                msg: 'Token no válido - usuario no existente'
            })            
        }
        req.usuario = usuario;
        
        console.log( req.usuario );
        next();
    }
    catch( err ){
        console.log( err );
        res.status( 401 ).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}