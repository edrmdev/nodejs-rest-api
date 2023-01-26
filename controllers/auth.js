const { reponse, json } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require( '../models/usuario' );
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const login = async ( req, res = response) => {
    
    const { correo, password } = req.body;
    
    try{
        //#1.- Verificar si email existe
        const usuario = await Usuario.findOne({ correo })
        if( ! usuario ){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            });
        }        
        //#2.- Si el usuario esta activo
        if( !usuario.estado ){
            return res.status( 400 ).json({
                msg: 'Usuario / password no son correctos - estado: false'
            }); 
        }
        
        //#3.- Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( ! validPassword ){
            return res.status(400).json({ msg: 'Password incorrecto' });
        }
        
        //#4.- Generar JWT
        const token = await generarJWT( usuario.id )

        res.json({
            msg: 'Login ok',
            usuario,
            token
        })
    }
    catch( err ){
        console.log( err );

        return res.status(500).json({
            msg: 'Algo salió mal, contacte con el administrador'
        })
    }
} 

const googleSignIn = async ( req, res = response ) => {

    const { id_token } = req.body;

    try{
        const { correo, nombre, img } = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne( { correo });

        if ( !usuario ) {
            const data = {
                nombre,
                correo,
                password: '_',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        if( !usuario.estado ){
            return res.status( 401 ).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        const token = await generarJWT( usuario.id );

        res.json({  
            msg: 'Se ha iniciado sesión mediante cuenta de Google correctamente',
            usuario,
            token
        })
    }
    catch( err ){
        console.log( err );
        res.status(400).json({
            ok: false,
            msg: 'No ha sido posible verificar el token',
        })
    }
}

module.exports = {
    login,
    googleSignIn,
}