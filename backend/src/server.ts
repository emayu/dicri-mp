/** 
 * @license 
 * Copyright (c) 2025 Héctor Yaque 
 * Licensed under the Creative Commons BY-NC-ND 4.0 license. 
 * See LICENSE file in the project root for full license information. 
 */ 
 
import express, { Express } from "express"; 
import morgan from "morgan"; 
import cors from 'cors';

import { sessionMiddleware } from "./config/session";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
 
console.log( 
    'ENV:', process.env.ENV, 
    'PORT:', process.env.PORT 
); 
 
const server:Express = express(); 
const PORT = process.env.PORT || 3000; 
 
const ENV = process.env.ENV || "DEV"; 
 
 
let ALLOWED_ORIGINS = ['http://localhost:5173'];
if( ENV === "PROD"){ 
    server.use(morgan('combined')); 
    ALLOWED_ORIGINS = ['produrl'];
}else{ 
    server.use(morgan('dev')); 
    ALLOWED_ORIGINS = ['http://localhost:5173'];
}

//Middlewares base
server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
server.use(express.json());
server.use(sessionMiddleware)

//Ruta base de servidor
server.use("/api/v1", apiRoutes);

//Middleware Error handler
server.use(errorHandler);
 
server.get('/', (req, res)=> { 
    res.send('Hello MP');   
}); 
 
//monitoring and health  
//aunque en la prueba no se pide esto es una buena practica para DevOps  
server.get('/version', (req, res) => { 
    res.status(200).json({ 
      version: process.env['BUILD_TAG'] || 'unknown', //for future deploys 
    }); 
  }); 
server.get('/healthz', (req, res) => res.json({ ok: true })); 
 
 
server.listen(PORT, ()=> { 
    console.log(`Hello MP from NodeJS + Typscript. Server started on ${PORT}` ) 
})