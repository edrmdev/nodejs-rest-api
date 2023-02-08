
const { 
        Categoria, 
        Producto,
        Role, 
        Usuario
    } = require('../models');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne( { rol } )
    if( !existeRol ){
            throw new Error(`El rol ${rol} no se encuentra en la base de datos`)
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne( { correo } );
    if( existeEmail ) {
        throw new Error( `El correo ${ correo } ya se encuentra registrado` );
    }
}

const existeUsuarioPorID = async (id = '') => {
    const existeID = await Usuario.findById(id);
    if( ! existeID ){
        throw new Error(`El ID ${ id }, no existe`);
    }
}

//Categorias----
const existeCategoriaPorID = async( id ) => {
    const existeID = await Categoria.findById(id);
    if( !existeID ){
        throw new Error( `El ID ${ id } no existe` );
    }
}

const existeCategoriaPorNombre = async( nombre = '' ) => {
    const categoriaDB = await Categoria.findOne({ nombre });
    if( categoriaDB ) {
        throw new Error( `La categoria ${ categoriaDB.nombre }, ya existe` )
    }
}

//Producto----
const existeProductoPorID = async ( id = '' ) => {

    const productoDB = await Producto.findById( id );
    if( ! productoDB ){
        throw new Error( `El ID ${ id } del producto no existe`);
    }
}

module.exports = {
    emailExiste,
    esRolValido,
    existeCategoriaPorID,
    existeCategoriaPorNombre,
    existeProductoPorID,
    existeUsuarioPorID,
}