import 'reflect-metadata';
import express from 'express';


import createConnection from './database';
import { router } from './routes';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

/*
  GET => Busca
  POST => Salvar
  PUT => Alterar
  DELETE => Deletar
  PATCH => Alteração específica
*/

// 1 param => Rota(Recurso API)
// 2 param = request, response

export { app };
