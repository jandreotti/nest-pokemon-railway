import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //! Opcion global para el prefijo de las rutas (le pongo api a todas las rutas REST de los controladores del proyecto)
  app.setGlobalPrefix('api/v2');


  //! CLAVE: !! Configuracion global de los pipes. -> Validacion de TODOS los DTOs. 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //! LIMPIA MI DTO DE CAMPOS QUE NO ESPECIFIQUE:  Elimina los campos que no esten definidos en el DTO. 
      forbidNonWhitelisted: true, //! Lanza un error si en la peticion mando campos que no estan definidos en el DTO. (DEBE SER USADO CON EL DE ARRIBA)

      // PRO: es mas facil de validar los datos que vienen en la peticion.
      // CONTRA: Si va informacion se tiene que procesar todo y eso requiere mas recursos.
      transform: true, //! Transforma los valores que vienen en la peticion a los tipos de datos que se definen en el DTO. (ESTO SIRVE PARA EL QUERY PARAMETERS en el pokemon.controller findAll(@Query() queryParameters: PaginationDto) {)
      transformOptions: {
        enableImplicitConversion: true //! Habilita la conversion implicita de los valores que vienen en la peticion a los tipos de datos que se definen en el DTO.
      }
    })
  );

  //si pongo esto va a borrar los valores de la peticion que no existen en el dto:
  // {whitelist: true}
  //si pongo esto va a lanzar un error si en la peticion mando campos que no estan definidos en el dto:
  // {whitelist: true,forbidNonWhitelisted: true}

  //! AQUI ESTAMOS FUERA DEL BUILDING BLOCK DE NEST -> por lo tanto no puedo usar la inyeccion de dependencias para usar ConfigService en el main.ts. Sino que tengo que usar directamente el process.env.PORT
  await app.listen(process.env.PORT || 3000);
  console.log(`App running on port ${process.env.PORT || 3000}`);
}

bootstrap();
