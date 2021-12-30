import { Server } from 'socket.io';
import axios from 'axios';
import pkg from 'pg';
import { FrontendUrl, KaientaiApiUrl } from './auxiliary/globalVariables.js';
const { Client } = pkg;

const client = new Client({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE
})

export const webSocketSetup = (server) => {
  var io = new Server(server, {
    cors: {
      origin: [
        FrontendUrl,
        `${FrontendUrl}/*`
      ]
    }
  });
  socketConnection(io);
  dbConnection(client, io);
}

const getOrders = async (io) => {
  await axios.get(`${KaientaiApiUrl}/orders`)
  .then(function (response) {
    if(response.status === 200) {
      io.emit('ordersUpdate', JSON.stringify(response.data.data.orders));
    } else {
      console.log("No Orders found.")
    }
  })
  .catch(function (error) {
    console.log(error);
  })
}

const getUsers = async (io) => {
  await axios.get(`${KaientaiApiUrl}/users`)
  .then(function (response) {
    if(response.status === 200) {
      io.emit('usersUpdate', JSON.stringify(response.data.data.users));
    } else {
      console.log("No Users found.")
    }
  })
  .catch(function (error) {
    console.log(error);
  })
}

const getProducts = async (io) => {
  await axios.get(`${KaientaiApiUrl}/products`)
  .then(function (response) {
    if(response.status === 200) {
      io.emit('productsUpdate', JSON.stringify(response.data.data.products));
    } else {
      console.log("No Products found.")
    }
  })
  .catch(function (error) {
    console.log(error);
  })
}

const socketConnection = async (io) => {
  io.on('connection', (socket) => {
    // Initial Connection
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    // Orders
    socket.on('orders', async (msg) => {
      console.log(msg)
      getOrders(io);
    });

    // Users
    socket.on('users', async (msg) => {
      console.log(msg)
      getUsers(io);
    });

    // Products
    socket.on('products', async (msg) => {
      console.log(msg)
      getProducts(io);
    });
  });
}

const dbConnection = async (client, io) => {
  client.connect(async (err) => {
    if (err) {
      console.log("Error in connecting database: ", err);
    } else {
      console.log("Database connected");
      client.on('notification', (msg) => {
        if(msg.channel === 'order_update_notification') getOrders(io)
        if(msg.channel === 'user_update_notification') getUsers(io)
        if(msg.channel === 'product_update_notification') getProducts(io)
      });
      const queryOrder = await client.query("LISTEN order_update_notification");
      const queryUser = await client.query("LISTEN user_update_notification");
      const queryProduct = await client.query("LISTEN product_update_notification");
    }
  })
}

export default webSocketSetup;