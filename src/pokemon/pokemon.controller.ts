import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @Post()
  // por defecto va a retornar el statuscode 201. Si quiero cambiar el status code tengo que hacerlo de la siguiente manera
  // @HttpCode(200)
  // @HttpCode(HttpStatus.OK) //200
  // @HttpCode(HttpStatus.CREATED) //201
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  //findAll(@Query() queryParameters) { //! QUERY PARAMETERS http://localhost:3000/pokemon?limit=5&offset=5
  //findAll(@Query() queryParameters: PaginationDto) {
  findAll(@Query() paginationDto: PaginationDto) {
    // console.log({ paginationDto });
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':terminoBusqueda')
  findOne(@Param('terminoBusqueda') terminoBusqueda: string) {
    return this.pokemonService.findOne(terminoBusqueda);
  }

  @Patch(':terminoBusqueda')
  update(@Param('terminoBusqueda') terminoBusqueda: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(terminoBusqueda, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
