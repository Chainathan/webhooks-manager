"use strict";

/**
 *  - Call test.hello action
 * 		http://localhost:3333/api/test/hello
 *
 *  - Call test.hi with alias
 * 		http://localhost:3333/api/hi?name=John
 */

let { ServiceBroker } = require("moleculer");
let ApiGatewayService = require("moleculer-web");
let express = require("express");

// Create broker
let broker = new ServiceBroker();

// Load other services
broker.loadService("services/test.service");

broker.createService(ApiGatewayService);

//Load API Gateway
const svc = broker.createService({
  name: "api",
  mixins: ApiGatewayService,

  settings: {
    server: false,
  },
});

// Create Express application
const app = express();

// Use ApiGateway as middleware
app.use("/api", svc.express());

// Listening
app.listen(3333, (err) => {
  if (err) return console.error(err);

  console.log("Open http://localhost:3333/api/test/hello");
});

// Start server
broker.start();
