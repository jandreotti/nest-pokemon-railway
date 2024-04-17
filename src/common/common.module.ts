import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
  imports: [],
  controllers: [],
  providers: [AxiosAdapter], //! AQUI EXPORTAMOS EL AxiosAdapter para poder usarlo en otro lado. 
  exports: [AxiosAdapter],
})
export class CommonModule { }
