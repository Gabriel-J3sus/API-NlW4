import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";

import createConnection from './database';
import { router } from './routes';
import { AppError } from './errors/AppError';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message
    })
  } else {
    return response.status(500).json({ status: "Error", message: `Internal server error ${err.message}` })
  }
})

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
