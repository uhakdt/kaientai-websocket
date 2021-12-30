// Dependencies
import "dotenv/config.js";
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { webSocketSetup } from "./webSocket.js";

// Express Setup
const port = process.env.PORT || 9929;
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const server = app.listen(port, () => {
  console.log("I am going to become the King of the Pirates. If this means I will die on the journey, so be it!")
  console.log(`Port ${port}`);
});

// Web Sockets Setup
webSocketSetup(server);