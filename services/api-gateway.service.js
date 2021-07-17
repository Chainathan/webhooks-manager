"use strict";

const { json } = require("express");
const express = require("express");
const ApiGateway = require("moleculer-web");
const hookService = require("../services/webhooks.service.js");

module.exports = {
  name: "api",
  mixins: [ApiGateway],

  settings: {
    // api gateway service listens on port 3000
    port: process.env.PORT || 3000,
    routes: [
      {
        autoAliases: true,
      },
    ],
  },
  methods: {
    // routing to appropriate actions in webhooks service
    initRoutes(app, ctx) {
      app.get("/register", async (req, res, ctx) => {
        res.send(
          await ctx.call("webhooks.register", {
            targetUrl: ctx.params.targetUrl,
          })
        );
      });
      app.get("/list", async (req, res, ctx) => {
        res.send(await ctx.call("webhooks.list"));
      });
      app.get("/update", async (req, res, ctx) => {
        res.send(await ctx.call("webhooks.update", { id: ctx.params.id }));
      });
      app.get("/delete", async (req, res, ctx) => {
        res.send(
          await ctx.call("webhooks.delete", {
            id: ctx.params.id,
            targetUrl: ctx.params.targetUrl,
          })
        );
      });
      app.get("/ip", async (req, res, ctx) => {
        res.send(
          await ctx.call("webhooks.trigger", {
            ip:
              req.headers["x-forwarded-for"] ||
              req.socket.remoteAddress ||
              null,
          })
        );
      });
      // debug
      app.get("/helloTest", async (req, res, ctx) => {
        res.send(await ctx.call("webhooks.hello"));
      });
      app.get("/exptest", (req, res) => {
        res.send("express routing");
      });
    },
  },

  created() {
    // express instance for routing
    const app = express();
    app.use(express.json());

    // for testing local services without routing
    app.use("/api", this.express());

    // init required routes from api service to webhook service
    this.initRoutes(app);
    this.app = app;
  },

  started() {
    // express server starts listening on port 3333
    this.app.listen(3333, (err) => {
      if (err) return console.error(err);

      console.log("listening at port localhost:3333");
    });
  },

  stopped() {
    if (this.app.listening) {
      this.app.close((err) => {
        if (err) return this.logger.error("express server close error!", err);

        this.logger.info("express server stopped!");
      });
    }
  },
};
