
const mongoose = require( 'mongoose' )
const { Schema, model } = mongoose; //require( 'mongoose' ); 
mongoose.Promise = global.Promise;

const usuarioSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//remover password y version al retornar la info del usuario.
usuarioSchema.methods.toJSON = function(){
    const {__v, password, ...usuario } = this.toObject();
    return usuario;
} 

module.exports = mongoose.models.Usuarios || model( 'Usuarios', usuarioSchema );
