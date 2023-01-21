
require ( 'colors' );
const Role = require('../models/role');
const Usuario = require( '../models/usuario' );

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne( { rol } )
    if( !existeRol ){
            console.log( `El rol ${ rol } no se encuentra en la base de datos`.red )
            throw new Error(`El rol ${rol} no se encuentra en la base de datos`)
    }
}

const emailExiste = async (correo = '') => {
    console.log( `El correo ingresado ya se encuentra registrado`.red );
    const existeEmail = await Usuario.findOne( { correo } );

    if( existeEmail ) {
        throw new Error( `El correo ${ correo } ya se encuentra registrado` );
        //return res.status( 400 ).json({ msg: `El correo ${ correo } ya se encuentra registrado` });
    }
}

module.exports = {
    esRolValido,
    emailExiste
}