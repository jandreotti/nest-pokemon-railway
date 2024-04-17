import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {


  constructor(
    //! SI QUISIERA USAR DIRECTAMENTE EL MODELO DE MONGOOSE LO HARIA DE ESTA MANERA
    @InjectModel(Pokemon.name) // Inyecto el modelo de mongoose. Lo tengo que hacer de esta manera porque no es un provider.  Esta es la implementacion propia que hizo nest para inyectar modelos de mongoose
    private readonly pokemonModel: Model<Pokemon>, // esto no es un provider entonces no es inyectable directamente, es un modelo de mongoose. Entonces tengo que inyectarlo con @InjectModel

    //! ESTA INYECCION DE DEPENDENCIA LA PUEDO HACER PORQUE EN EL pokemon.module.ts esta puesto el exports: [PokemonService]
    //! Y porque en el seed.module.ts esta puesto el imports: [PokemonModule] 
    private readonly pokemonService: PokemonService, // ESTO ES UNA DEPENDENCIA DE MI SERVICIO

    private readonly http: AxiosAdapter //! Esto es un adaptador de la libreria usada para hacer peticiones http
  ) { }


  // Esto lo reemplace con AxiosAdapter
  //private readonly axios: AxiosInstance = axios; // Esto muestra que es una dependencia de mi servicio. Deberiamos transformar esto en un custom provider



  async executeSeed() {
    //- https://pokeapi.co/api/v2/pokemon?limit=650

    // const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600');
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600');

    await this.pokemonModel.deleteMany({}); // Borro todos los registros de la coleccion

    // const start = new Date();


    //! Inserciones una por una 
    // data.results.forEach(async ({ name, url }) => { //144ms
    //   // url -> https://pokeapi.co/api/v2/pokemon/1/
    //   const no: number = +url.split("/").slice(-2, -1);//url.split("/")[url.split("/").length - 2]; // url.split("/")[6]   

    //   // await this.pokemonService.create({ no, name }); //! USANDO EL SERVICIO 
    //   const pokemon = await this.pokemonModel.create({ no, name }); //144ms //! USANDO EL MODELO DE MONGOOSE
    // });


    //! Inserciones en paralelo
    // const promesasInserciones = data.results.map(({ name, url }) => {
    //   // url -> https://pokeapi.co/api/v2/pokemon/1/
    //   const no: number = +url.split("/").slice(-2, -1);//url.split("/")[url.split("/").length - 2]; // url.split("/")[6]   

    //   return this.pokemonService.create({ no, name });
    // });
    // Promise.all(promesasInserciones);


    //! Una sola insercion de multiples entradas
    const pokemonToInsert: { name: string, no: number; }[] = [];
    const promesasInserciones = data.results.map(({ name, url }) => {
      // url -> https://pokeapi.co/api/v2/pokemon/1/
      const no: number = +url.split("/").slice(-2, -1);//url.split("/")[url.split("/").length - 2]; // url.split("/")[6]   

      pokemonToInsert.push({ no, name }); //[{name:"bulbasor",no:1}, ...{},...]
    });
    await this.pokemonModel.insertMany(pokemonToInsert);


    // const end = new Date();
    // console.log(end.getTime() - start.getTime(), "ms");
    // console.log((end.getTime() - start.getTime()) / 1000, "s");


    return "Seed ejecutado con exito";

  }

  async executeDeleteAll() {

    await this.pokemonModel.deleteMany({});

    return "Registros eliminados con exito";
  }


}
