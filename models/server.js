const express = require('express');
const cors = require('cors');
const { dbConnection } = require( '../database/config' );
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
            productos: '/api/productos',
        }

        //Conectar a base de datos
        this.conectarBD();
        //Middlewares (funcion que se ejecuta cuando levantamos el servidor)
        this.middlewares();

        //Rutas de aplicacion
        this.routes();
    }

    async conectarBD() {
        await dbConnection();
    }

    middlewares() {
        
        //CORS
        this.app.use( cors() )

        //Lectura y parseo del body
        this.app.use( express.json() )

        //Directorio publico
        this.app.use( express.static('public') )
    }

    routes() {

        this.app.use( this.paths.auth, require('../routes/auth' ));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.categorias, require('../routes/categorias') );
        this.app.use( this.paths.productos, require('../routes/productos') );
        this.app.use( this.paths.usuarios, require('../routes/usuarios') );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', process.env.PORT )
        })
    }
}

module.exports = Server;