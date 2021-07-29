const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { restricted } = require('./middleware/middleware');

const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");
const potlucksRouter = require("./potlucks/potlucks-router");

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);
server.use("/api/potlucks", restricted, potlucksRouter);

server.use("*", (req, res, next) => { //eslint-disable-line
  res.status(404).json({
    message: "page not found, sorry!",
  });
});

server.use((err, req, res, next) => { //eslint-disable-line
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
