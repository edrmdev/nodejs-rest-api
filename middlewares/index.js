//Middlewares

const validaCampos = require('../middlewares/validar-campos');
const validarSubirArchivo = require( '../middlewares/validar-archivo');
const validarJWT  = require( '../middlewares/validar-jwt' );
const validaRoles = require('../middlewares/validar-roles');

module.exports = {
    ...validarSubirArchivo,
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
}