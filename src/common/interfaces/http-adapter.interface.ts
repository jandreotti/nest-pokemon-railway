//! aca tiene la definicion de loq ue necesito que tenga una clase HttpAdapter

export interface HttpAdapter {

  get<T>(url: string): Promise<T>; // Las clases que implementen esta interfaz van a tener que tener un metodo get que reciba un string y devuelva una promesa de tipo T.
}