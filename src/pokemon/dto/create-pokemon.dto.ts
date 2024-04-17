import { IsInt, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";

//! Esta es la data que yo voy a recibir epor REST
export class CreatePokemonDto {

  // isInt, isPositive, min 1,
  // 
  @IsInt()
  @IsPositive()
  @Min(1)
  no:number;

  // isString, minLengeth 3, maxLenght 50
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name:string;
}
