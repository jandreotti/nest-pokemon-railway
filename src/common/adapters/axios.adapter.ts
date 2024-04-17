import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";


// si nosotros queremos inyectarlo en nuestros servicios, tenemos que decorarlo con el decorador @Injectable
// los inyectables estan a nivel de modulos. Osea que tengo que exportalo en el modulo para poder usarlo en otro modulo

@Injectable()
export class AxiosAdapter implements HttpAdapter {

  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    }
    catch (e) {
      console.error(e);
      throw new Error("Error en la peticion GET - AXIOS");
    }
  }

}