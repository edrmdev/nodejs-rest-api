const mongoose = require('mongoose' );
const { Schema, model } = mongoose;

const roleSchema = new Schema({
    rol: {
        type: String,
        required: [ true, 'El rol es obligatorio' ],
    }
});

const Role = mongoose.models.Roles || model('Roles', roleSchema);

module.exports = Role;