const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { 
    validarCampos, 
    validarJWT, 
    esAdminRole 
} = require( '../middlewares' );
const { 
       borrarCategoria, 
       crearCategoria, 
       obtenerCategorias,
       obtenerCategoriaID,
       actualizarCategoria
    } = require( '../controllers/categorias');
const { existeCategoriaPorID, existeCategoriaPorNombre } = require( '../helpers/db-validators' );
const router = Router();

//Estructura de ruta: { tipoDePeticion(post, get, put), 'ruta', [middlewares], controller }

//* DONE!!!
//Todas las categorias (publico)
router.get( '/', obtenerCategorias );

//TODO validar id 
//Categoria por id - publico
router.get( '/:id', [
    check( 'id', 'El ID no es válido' ).isMongoId(),
    validarCampos
    //check( 'id' ).custom( existeCategoria ) //si no existe lanza error
], obtenerCategoriaID)

//Crear categoria - Privado - Cualquier persona con token valido
router.post( '/', [
     validarJWT,
     check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
     validarCampos,
], crearCategoria )

// Actualizar - privado - cualquiera con token valido
router.put( '/:id', [
    validarJWT,
    check( 'id' ).custom( existeCategoriaPorID ),
    check( 'nombre' ).custom( existeCategoriaPorNombre ),
    validarCampos
], actualizarCategoria);

//* DONE!!!
// Borrar una categoria - Admin
router.delete( '/:id', [
    validarJWT,
    esAdminRole,
    check( 'id', 'El ID no es válido').isMongoId(),
    validarCampos
], borrarCategoria)

module.exports = router;
// #1.- Para crear rutas solicitar la funcion router de express.
// #2.- Solicitar la funcion check para realizar validaciones (express-validator).
         //Instanciar path de api en middleware de clase server
// #3.- Validaciones mediante middleware (validar campos).
// #4.- Instanciar Router en un objeto.
// #5.- Crear paths de rutas con middlewares.