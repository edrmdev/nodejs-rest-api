const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { login } = require( '../controllers/auth' );
const { validarCampos } = require('../middlewares/validar-campos');
const router = new Router();

router.post( '/login', [
 check( 'correo', 'No es un correo válido' ).isEmail(),
 check( 'password', 'La contraseña es obligatoria' ).not().isEmpty(),
 validarCampos
], login );

module.exports = router;