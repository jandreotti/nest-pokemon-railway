// Este archivo puede llamarse env.config.ts
// Funcion que Mapea mis variables de entorno a un objeto 

export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || "dev", // ahora tenemos una variable de entorno que se llama NODE_ENV que puede ser dev o prod o testing
  //
  //

  port: process.env.PORT || 3001,

  mongodb_url: process.env.MONGODB_URL, // Aqui no pongo variables por defecto porque si no tengo esta informacion por defecto me confiene que la aplicacion tire error. 
  mongodb_db: process.env.MONGODB_DB,// Aqui no pongo variables por defecto porque si no tengo esta informacion por defecto me confiene que la aplicacion tire error. 
  mongodb_user: process.env.MONGODB_USER,// Aqui no pongo variables por defecto porque si no tengo esta informacion por defecto me confiene que la aplicacion tire error. 
  mongodb_pass: process.env.MONGODB_PASS,// Aqui no pongo variables por defecto porque si no tengo esta informacion por defecto me confiene que la aplicacion tire error. 

  default_limit: +process.env.DEFAULT_LIMIT || 7

});


// lo de arriba es basicamente esto: una funcion que retorna un objeto
// export const EnvConfiguration=()=>{
//   return {
//        ...
//   }
// }