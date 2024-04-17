<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio

2. Ejecutar

```
npm install
```

3. Tener Nest CLI instalado

```
npm i -g @nestjs/cli
```

4. levantar la base de datos

```
docker-compose up -d
```

5. Clonar el archivo __.env.template__ y renombrarlo a ```.env``` 

6. Llenar las variables de entorno definidas en el ```.env```

7. Ejecutar

```
npm run start:dev
```

8. Seed de la base de datos. Ir a la siguiente url (Va a borrar todos los pokemons existentes)

```
127.0.0.1:3000/api/v2/seed
```



## Stack usado

- MongoDB
- NestJS
- Docker
