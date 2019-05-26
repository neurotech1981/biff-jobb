const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const path = require("path");

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "";

// Validation
const validateInput = require("../validation/input-validation");

// connects our back end code with the database
try {
  mongoose.connect(
    dbRoute,
    {
      useNewUrlParser: true
    }
  );
} catch (error) {}

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "../build")));
app.get("/", function(req, res, next) {
  res.sendFile(path.resolve("../build/index.html"));
});

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err)
      return res.json({
        success: false,
        error: err
      });
    return res.json({
      success: true,
      data: data
    });
  });
});

router.post("/updateDate", (req, res) => {
  let data = new Data();

  const { id, varenummer, varenavn, pdato, bf, lokasjon, vekt } = req.body;
  if (
    (!id && id !== 0) ||
    !varenummer ||
    !varenavn ||
    !pdato ||
    !bf ||
    !lokasjon ||
    !vekt
  ) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.varenummer = varenummer;
  data.id = id;
  data.varenavn = varenavn;
  data.pdato = pdato;
  data.bf = bf;
  data.lokasjon = lokasjon;
  data.vekt = vekt;
  data.save(err => {
    if (err)
      return res.json({
        success: false,
        error: err
      });
    return res.json({
      success: true
    });
  });
});

// this is our old update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, err => {
    if (err)
      return res.json({
        success: false,
        error: err
      });
    return res.json({
      success: true
    });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, err => {
    if (err) return res.send(err);
    return res.json({
      success: true
    });
  });
});

// this is our create method
// this method adds new data in our database
router.post("/putData", (req, res) => {
  const { errors, isValid } = validateInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }
  let data = new Data();
  const { id, varenummer, varenavn, pdato, bf, lokasjon, vekt } = req.body;

  if (
    (!id && id !== 0) ||
    !varenummer ||
    !varenavn ||
    !pdato ||
    !bf ||
    !lokasjon ||
    !vekt
  ) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  data.varenummer = varenummer;
  data.id = id;
  data.varenavn = varenavn;
  data.pdato = pdato;
  data.bf = bf;
  data.lokasjon = lokasjon;
  data.vekt = vekt;
  data.save(err => {
    if (err)
      return res.json({
        success: false,
        error: err
      });
    return res.json({
      success: true
    });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
