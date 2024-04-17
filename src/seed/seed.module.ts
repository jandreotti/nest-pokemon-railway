import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ //! AQUI IMPORTAMOS UN MODULO -> IMPORTAMOS TODO LO QUE ESTA EN EL EXPORT DEL MODULO IMPORTADO
    PokemonModule,// Importamos el modulo de Pokemon para poder usar el pokemonModel o el servicio de PokemonService
    CommonModule, // Importamos el modulo de Common para poder usar el AxiosAdapter
  ],
})
export class SeedModule { }
