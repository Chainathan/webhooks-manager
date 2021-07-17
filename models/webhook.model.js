"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let webhookSchema = new Schema({
  targetUrl: {
    type: String,
  },
});

module.exports = mongoose.model("webhook", webhookSchema);
