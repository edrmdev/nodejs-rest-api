const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require( '../models/usuario' );

const usuariosGet = (req = request, res = response) => {
    const {
        q,
        nombre = 'No name',
        apikey,
        page = 1,
        limit = 10
    } = req.query;

    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPost = async (req, res = response) => {


    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );
   

    //Encriptar password
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en BD
    await usuario.save()

    res.json({
        msg: 'post API - Controlador',
        usuario
    })
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
        msg: 'Put API - Controlador',
        usuario
    })
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'Patch API - Controlador'
    })
}

const usuariosDelete = (req, res = response) => {
    const body = req.body;

    res.json({
        msg: 'Delete API - Controlador',
        body
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch,
}