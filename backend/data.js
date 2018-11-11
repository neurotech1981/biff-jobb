// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DataSchema = new Schema(
  {
    id: Number,
    varenummer: Number,
    varenavn: String,
    pdato: Date,
    bf: Date,
    lokasjon: Number,
    vekt: Number
  },
  { timestamps: false }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);