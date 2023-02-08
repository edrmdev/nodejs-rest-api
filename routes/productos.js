const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const {
     validarCampos,
     validarJWT,
     esAdminRole
 } = require( '../middlewares' );

 const {
    crearProducto, obtenerProductos, obtenerProductosID, actualizarProducto, borrarProducto
} = require( '../controllers/productos' );
const { existeProductoPorID } = require('../helpers/db-validators');

const router = Router();


//get all productos
router.get('/', obtenerProductos);

//get all products with id
router.get( '/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorID),
    validarCampos
],obtenerProductosID);

//Crear productos - con token valido
router.post( '/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearProducto)

//Actualizar productos
router.put( '/:id', [
    validarJWT,
    check( 'id', 'No es un ID Valido').isMongoId(),
    check('id').custom( existeProductoPorID ),
    validarCampos
], actualizarProducto)

//Borrar productos - admin
router.delete( '/:id', [
    validarJWT,
    esAdminRole,
    check( 'id', 'No es un ID Valido').isMongoId(),
    check( 'id' ).custom( existeProductoPorID),
    validarCampos
], borrarProducto);

module.exports = router;