import express from "express";
// import { Server } from "socket.io";
// import { loggerHttp } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { __dirname } from "./dirname-utils.js";
import morgan from 'morgan'
import cartsRouter from './routes/carts.js';
import productsRouter from './routes/products.js';
import userRouter from './routes/user.js';

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(loggerHttp);
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});