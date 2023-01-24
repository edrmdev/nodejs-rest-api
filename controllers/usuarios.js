const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require( '../models/usuario' );
require('colors');

const usuariosGet = async (req = request, res = response) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };
    

    /*
    const usuarios = await Usuario.find( query )
        .skip( Number(desde) )
        .limit( Number(limite) );

    const total = await Usuario.count( query );
    */

    let myMessage = '';
    
    const [ total, usuarios ] = await Promise.all( [
        Usuario.count(query),
        Usuario.find( query ).skip( Number(desde) ).limit( Number(limite) )
    ]);

    
    if( total > 0 )
        myMessage = `Se han encontrado un total de ${ total } usuarios`;
    else 
        myMessage = `Se han encontrado ${ total } resultados`;
    

    res.json({
        msg: 'Lista de usuarios - ' + myMessage,
        total,
        usuarios,
    });
}

const usuariosPost = async (req, res = response) => {


    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );
   

    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en BD
    await usuario.save();

    res.json(usuario);
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, correo,   google, ...resto } = req.body;

    if( password ) {

        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        //msg: 'Put API - Controlador',
        usuario
    })
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'Patch API - Controlador'
    })
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;
    const body = req.body;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });

    res.json({
        msg: 'Delete API - Controlador',
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch,
}