import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';


@Module({
  imports: [


    //! Cargo las variables de entorno del archivo .env
    // Esto debe ir primero para que las variables de entorno esten disponibles en toda la aplicacion
    ConfigModule.forRoot({
      // envFilePath: '.env', // esto es para que yo lea un archivo diferente al .env
      // isGlobal: true, // Hace que las variables de entorno esten disponibles en toda la aplicacion SIN LA NECESIDAD DE TENER QUE IMPORTARLAS EN EL MODULO DEL SERVICIO EN DONDE LAS VOY A NECESITAR USAR

      // Estos dos parametros son para que yo pueda usar la funcion de mapeo de variables de entorno y el esquema de validacion de las variables de entorno.
      // Si bien puede parecer que hacen lo mismo, puedo igualmente usarlo en conjunto
      load: [EnvConfiguration], // Cargo la funcion que mapea mis variables de entorno a un objeto //! 2º vengo y ejecuto este metodo. 
      validationSchema: JoiValidationSchema, // Cargo el esquema de validacion de las variables de entorno de JOI //! 1º verifico si las variables de entorno existen y sino las creo y pongo x defecto. 
    }),

    //! ServeStaticModule.forRoot() -> Configuración para servir archivos estáticos
    ServeStaticModule.forRoot({

      rootPath: join(__dirname, '..', 'public'),
      //exclude: ['/api*'], // Excluimos la ruta /api* para que no se sirva el archivo estático //! ESTE NO ANDA
      exclude: ['/api/(.*)'], //! ESTE SI ANDA




    }),

    //! Conexion a la base de datos
    // Tengo que agregar los datos de conexion abajo, sino lo pongo asi no funciona (para que me tome el usuario, password y el nombre de la base de datos le agrego el objeto de abajo FUENTE: https://stackoverflow.com/questions/72761175/mongo-doesnt-let-nestjs-create-a-new-db)
    // mongodb://user:123456@localhost:27017/nest-pokemon -> Formato de la conexion
    //
    // MongooseModule.forRoot(
    //   'mongodb://localhost:27017',
    //   {
    //     dbName: 'nest-pokemon',
    //     user: 'user',
    //     pass: '123456',
    //   }
    // ),
    //
    MongooseModule.forRoot(
      process.env.MONGODB_URL,
      {
        dbName: process.env.MONGODB_DB,
        user: process.env.MONGODB_USER,
        pass: process.env.MONGODB_PASS,
      }
    ),

    //! Importamos el módulo PokemonModule
    PokemonModule,

    //! Importamos el modulo de common
    CommonModule,

    SeedModule,



  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  //! Constructor -> Como en algun momento esta clase se instancia, se ejecuta el constructor
  constructor() {
    // console.log('AppModule cargado');
    // console.log({ variablesEntorno: process.env });
    // console.log(process.env.MONGODB_URL);
  }

}
