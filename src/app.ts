import express from 'express';
import { router } from "./Routers";
import { logger } from './middlewares/log';
const http = require('http');
import cors from 'cors';
import mongoose from 'mongoose'; // 引入 mongoose
require('dotenv').config()

const app: express.Application = express();
const server = http.createServer(app);

// MongoDB 連線設定
const mongoURI = `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`;

mongoose.connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200,
  "exposedHeaders": ['Content-Disposition']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use('/assets', express.static(process.env.assetsPath as string));

// 使用路由
for (const route of router) {
  app.use(route.getRouter());
}

// 啟動伺服器
server.listen(process.env.PORT, () => {
  logger.info('listening on *:' + process.env.PORT);
});
