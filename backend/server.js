const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
var proxy = require('http-proxy-middleware')
const logger = require("morgan");

const Data = require("./data");

const API_PORT = process.env.PORT || 3000;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb://jobb:946Dypew!@ds247223.mlab.com:47223/jobb-biff";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var customRouter = function(req) {
  return 'https://biff-jobb.herokuapp.com' // protocol + host
}

var options = {
  target: 'http://localhost:5000',
  router: router
}

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


//api for Update data from database  
/*router.post("/updateData",function(req,res){   
  Data.findByIdAndUpdate(req.params.id, {$set: req.body},   
 function(err) {  
  if (err) {  
  res.send(err);  
  return;  
  }  
  res.send({data:"Record has been Updated..!!"});  

  });  
 })
 */
router.post("/updateDate", (req, res) => {
  let data = new Data();

  const { id, varenummer, varenavn, pdato, bf, lokasjon, vekt } = req.body;

  if ((!id && id !== 0) || !varenummer || !varenavn || !pdato || !bf || !lokasjon || !vekt) {
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
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


// this is our old update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create method
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, varenummer, varenavn, pdato, bf, lokasjon, vekt } = req.body;

  if ((!id && id !== 0) || !varenummer || !varenavn || !pdato || !bf || !lokasjon || !vekt) {
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
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

var myProxy = proxy(options)

// append /api for our http requests / was app.use("/api", router);
app.use("/api", myProxy);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
