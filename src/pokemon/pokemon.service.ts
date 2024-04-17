import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number; // Esto lo hago para que se vea mas limpio y que no haya una dependencia oculta en el codigo

  constructor(
    @InjectModel(Pokemon.name) // Inyecto el modelo de mongoose. Lo tengo que hacer de esta manera porque no es un provider.  Esta es la implementacion propia que hizo nest para inyectar modelos de mongoose
    private readonly pokemonModel: Model<Pokemon>, // esto no es un provider entonces no es inyectable directamente, es un modelo de mongoose. Entonces tengo que inyectarlo con @InjectModel


    private readonly configService: ConfigService
  ) {
    // console.log(process.env.DEFAULT_LIMIT); 

    //const  default_limit  = configService.get<number>('default_limit');
    //console.log(default_limit); //--> Aqui va el valor de la propiedad del objeto que defini en app.config.ts

    this.defaultLimit = configService.get<number>('default_limit');



  }

  // le pongo async porque las insersiones a la base de datos son asincronicas
  async create(createPokemonDto: CreatePokemonDto) {

    // validaciones y acomodaciones
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      // Grabo en la base de datos
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      // retorno el pokemon
      return pokemon;

    }
    catch (e) {
      this.handleExceptions(e);
    }
    // return 'This action adds a new pokemon';
  }

  async findAll(paginationDto: PaginationDto) {

    // console.log(+process.env.DEFAULT_LIMIT); // Puede ser undefined -> NaN y que me de error la aplicacion


    //desestructuracion
    const {
      //limit = 5, // valores por defecto
      // limit = this.configService.get<number>('default_limit'), // valores por defecto
      limit = this.defaultLimit, // valores por defecto
      offset = 0 // valores por defecto
    } = paginationDto;

    // return  this.pokemonModel.find();
    return await this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1 // 1 es ascendente, -1 es descendente
      })
      .select( // selecciono los campos que quiero que me devuelva quitando los que no quiero (quito el __v que es un campo de version de mongoose)
        "-__v"
      );



    //return `This action returns all pokemon`;
  }

  async findOne(terminoBusqueda: string) {
    let pokemon: Pokemon; // es de tipo pokemon.entity



    // si es un numero busco por el Numero ("no")
    if (!isNaN(+terminoBusqueda)) {
      pokemon = await this.pokemonModel.findOne({ no: terminoBusqueda });
    }

    // si no tengo un pokemon y  si es un mongoid busco por el MongoID
    if (!pokemon && isValidObjectId(terminoBusqueda)) {
      pokemon = await this.pokemonModel.findById(terminoBusqueda);
    }

    //Si hasta aca no tengo ningun pokemon encontrado, intento buscarlo por el Name
    if (!pokemon) {

      // pokemon = await this.pokemonModel.findOne({ name: terminoBusqueda.toLowerCase().trim() }); // Busqueda exacta

      var regex = RegExp(".*" + terminoBusqueda.toLowerCase().trim() + ".*"); // Busqueda parcial (case insensitive) %LIKE%
      pokemon = await this.pokemonModel.findOne({ name: regex });
    }

    // Si no encontre el pokemon lanzo un error 404
    if (!pokemon)
      throw new NotFoundException(`Pokemon with no, id or name  "${terminoBusqueda}" not found`);


    // retorno el pokemon
    return pokemon;

    // return `This action returns a #${id} pokemon`;
  }

  async update(terminoBusqueda: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(terminoBusqueda); // si en este metodo no encuentra el pokemon, lanza la excepcion y hasta ahi llega la ejecucion
    // aqui ya encontro el pokemon (seria el modelo de mongoose)

    // valido y configuro el pokemon que me mandan a actualizar como necesite
    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    // actualizo el pokemon

    try {
      await pokemon.updateOne(updatePokemonDto);

      // Esto de aqui abajo deberia funcionar pero no funciona.  (ara obtener el pokemon actualizado)
      // entonces lo hago de la manera de abajo
      // await pokemon.updateOne(updatePokemonDto,
      // {
      // new: true, // me devuelve el pokemon actualizado
      // }); 

      // retorno el pokemon actualizado
      return { ...pokemon.toJSON(), ...updatePokemonDto }; // al pokemon le pongo el .toJSON() para que me devuelva un objeto plano de javascript sin todos los metodos de mongoose
    }
    catch (e) {
      this.handleExceptions(e);
    }


    //return `This action updates a #${id} pokemon`;
  }

  async remove(id: string) {

    // De esta manera hago la eliminacion por id, nombre o numero (En el controller deberia sacar la validacion de ParseMongoIdPipe)
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();



    // De esta manera elimino el pokemon por id de mongo
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    // if (!result) throw new NotFoundException(`Pokemon with id ${id} not found`);

    const { acknowledged, deletedCount } = await this.pokemonModel.deleteOne({ _id: id }); // Esto me devuelve: {"acknowledged": true,"deletedCount": 0}
    if (deletedCount === 0) throw new NotFoundException(`Pokemon with id ${id} not found`);
    // return; // esto no hace falta.


    // return `This action removes a #${id} pokemon`;
  }


  //--------------------------------------------------------------------------------

  private handleExceptions(error: any) {
    // Error de campos duplicados (no o name)
    // [Nest] 19580  - 08/04/2024, 13:27:03   ERROR [ExceptionsHandler] E11000 duplicate key error collection: nest-pokemon.pokemons index: name_1 dup key: { name: "bow" }
    if (error.code === 11000) {
      // throw new BadRequestException(`Pokemon already exists in db ${JSON.stringify(e.keyValue)}`);
      throw new ConflictException(`Pokemon with ${Object.keys(error.keyPattern)}: ${Object.values(error.keyValue,)} already exists`);
    }

    // Error generico si no es alguno de los particulares de arriba
    console.log({ error });
    throw new InternalServerErrorException("Error creating pokemon - Check server logs");
  }
}
