

const { Router } = require( 'express' );
const { check } = require( 'express-validator' );

const { 
     validarCampos, 
     validarJWT, 
     esAdminRole, 
     tieneRole,
} = require( '../middlewares' );

const { esRolValido, emailExiste, existeUsuarioPorID } = require('../helpers/db-validators');
const { usuariosGet,
        usuariosPost,
        usuariosPatch,
        usuariosDelete,
        usuariosPut
     } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put( '/:id', [
     check('id', 'El ID no es válido').isMongoId(),
     check( 'id' ).custom( existeUsuarioPorID ),
     check( 'rol' ).custom( esRolValido ),
     validarCampos
], usuariosPut);

router.post('/', [ 
     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
     check('password', 'El password debe de ser de más de 6 letras').isLength({ min: 6 }),
     check( 'correo', 'El correo no es válido' ).isEmail(),
     check( 'correo').custom( emailExiste ),
     //check( 'rol', 'No es un rol válido' ).isIn(['USER_ROLE', 'ADMIN_ROLE']),
     check( 'rol' ).custom( esRolValido ),
     validarCampos
], usuariosPost);

router.delete('/:id', [
     validarJWT,
     //esAdminRole,
     tieneRole( 'ADMIN_ROLE', 'VENTAS_ROLE', 'OTROS_ROLE' ), 
     check( 'id', 'El ID no es válido').isMongoId(),
     check( 'id' ).custom( existeUsuarioPorID ),
     validarCampos
] ,usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;