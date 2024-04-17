//! Este es un custom pipe MIO que se encarga de validar que el id que le llega por parametro sea un mongoID valido


import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform { // Todos los pipes deben implementar el pipe transfrorm
  transform(value: string, metadata: ArgumentMetadata) {

    // valido que sea un mongoID valido
    if (!isValidObjectId(value)) throw new BadRequestException(`${value} is not a valid mongo id`);

    return value;
  }
}
