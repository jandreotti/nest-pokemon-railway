//! Normalmente las entidades hacen una relacion con la base de datos
//! Una instancia esta clase seria un registro (colexiones y documentos) de la base de datos. 

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema() //! Decorador que indica a nest que es un esquema de la base de datos
export class Pokemon extends Document { //! Al extenderse de document, se convierte en una entidad de la base de datos y le agrega  todas las funcionalidades respectivas de la base de datos Mongo

  // id: string;// no es necesario ponerlo, ya que por defecto mongo lo crea


  //------------- name ----------------
  @Prop({
    unique: true, //! Indica que es unico
    index: true, //! Indica que es un indice
  }) //! Decorador que indica que es una propiedad de la base de datos (campo)
  name: string;

  //------------- no (numero)  ----------------
  @Prop({
    unique: true, //! Indica que es unico
    index: true, //! Indica que es un indice
  }) //! Decorador que indica que es una propiedad de la base de datos (campo)
  no: number; // numero del pokemon

}

//! Exporto el Schema

export const PokemonSchema = SchemaFactory.createForClass(Pokemon); //! Exporto el esquema basado en la clase de arriba
