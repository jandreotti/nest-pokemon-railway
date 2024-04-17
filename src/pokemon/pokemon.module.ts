import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],

  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ])
  ],
  exports: [// ESTO ES LO QUE YO VOY A EXPORTAR DE ESTE MODULO PARA QUE SEA VISIBLE AL EXTERIOR
    //! CON ESTO PUEDO USAR EL pokemonModel en el seedService
    MongooseModule
    // .forFeature([
    //   {
    //     name: Pokemon.name,
    //     schema: PokemonSchema,
    //   },
    // ])
    ,

    //! CON ESTO PUEDO USAR EL pokemonService en el seedService
    PokemonService
  ]
})
export class PokemonModule { }
