"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const webhookSchema = require("../models/webhook.model.js");
// for http post request
const axios = require("axios");

module.exports = {
  name: "webhooks",
  mixins: [DbService],
  // mongoDB hosted in cloud..mongoDB atlas
  adapter: new MongooseAdapter(
    "mongodb+srv://dbRoot:dbRoot@cluster0.tw1de.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  ),
  model: webhookSchema,
  settings: {
    // fields: ["_id", "targetUrl"],
    routes: [
      {
        bodyParsers: {
          json: {
            strict: false,
            limit: "1MB",
          },
          urlencoded: {
            extended: true,
            limit: "1MB",
          },
        },
      },
    ],
  },
  // CRUD and trigger actions
  actions: {
    // fetch all the webhooks in the database
    list: {
      rest: {
        method: "GET",
        path: "/list",
      },
      async handler(ctx) {
        console.log("listing");
        return ctx.call("webhooks.find");
      },
    },
    // create a new webhook in the database, returns id
    register: {
      params: {
        targetUrl: "string",
      },
      rest: "POST /register",
      async handler(ctx) {
        console.log("registering");
        // const url = ctx.params.targetUrl;
        const url = targetUrl;
        const { _id: id } = await ctx.call("webhooks.create", {
          targetUrl: url,
        });
        return id;
      },
    },
    // delete a webhook from the database, by id
    delete: {
      params: {
        id: "string",
      },
      rest: "DELETE /delete",
      async handler(ctx) {
        console.log("deleting");
        // const id = ctx.params.id;
        return ctx.call("webhooks.remove", { id });
        // return id;
      },
    },
    // update existing webhook in the database by id
    update: {
      params: {
        id: "string",
        targetUrl: "string",
      },
      rest: "PATCH /update",
      async handler(ctx) {
        console.log("deleting");
        return ctx.call("webhooks.update", { id, targetUrl }, (err) => {
          if (err) return console.error(err);
          return "Update successful";
        });
      },
    },
    // fetch all the webhooks in the database
    // send http post request to all the webhooks with the ip address and time stamp
    trigger: {
      rest: "GET /ip",
      params: {
        ip: String,
      },
      async handler(ctx) {
        console.log("webhooking");
        const data = await ctx.call("webhooks.find");
        for (var webhook in data) {
          const url = data[webhook].targetUrl;
          const time = Math.floor(new Date().getTime() / 1000);
          // console.log(url + " " + time);
          // send http post request to all the webhooks in the database
          axios
            .post(url, {
              ip_address: ip,
              time_stamp: time,
            })
            .then((res) => {
              console.log(`statusCode: ${res.statusCode}`);
              console.log(res);
            })
            .catch((error) => {
              console.error(error);
            });
        }
        return data[0].targetUrl;
      },
    },
    hello: {
      async handler(req, res) {
        res.send("helloooo");
      },
    },
  },
};
