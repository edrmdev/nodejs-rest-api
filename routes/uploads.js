const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { validarCampos, validarSubirArchivo } = require('../middlewares');
const { cargarArchivo, actualizarImagen, actualizarImagenCloudinary, mostrarImagen } = require( '../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router = new Router();

router.post( '/', validarSubirArchivo,cargarArchivo );

router.put( '/:coleccion/:id', [
  validarSubirArchivo, 
  check( 'id', 'El id debe ser de mongo').isMongoId(),
  check( 'coleccion' ).custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
  validarCampos
], actualizarImagenCloudinary)

router.get( '/:coleccion/:id', [
    check( 'id', 'El id debe ser de mongo').isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

module.exports = router;