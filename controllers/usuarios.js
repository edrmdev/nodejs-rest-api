const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {
    const {
        q,
        nombre = 'No name',
        apikey,
        page = 1,
        limit = 10
    } = req.query; // para obtener parametros desde el metodo get se utiliza
    //la funcion query, en caso de ser un metodo post la solicitud se obtiene mediante un request.body;

    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API - Controlador',
        nombre,
        edad
    })
}

const usuariosPut = (req, res = response) => {
    const { id } = req.params;

    res.json({
        msg: 'Put API - Controlador',
        id
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