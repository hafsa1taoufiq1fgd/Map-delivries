var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
var indexRouter = require('./routes/index');
var fileupload = require("express-fileupload");

const fs = require('fs');
// const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')
const DIR = 'upload';
var app = express();
app.use(fileupload());
// view engine setup
const Port = process.env.PORT || 7000
var app = express();
app.use(cors())

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + "test"+ path.extname(file.originalname));
  }
});
let upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {


  res.json("Hey")

});
var XLSX = require('xlsx')
app.post("/upload", upload.single('file'), async (req, res) => {
  console.log(req.file)
  // console.log(req.body)
  console.log('*********************')
  var workbook = XLSX.readFile('./upload/file-test.xlsx');
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  console.log(xlData);
  res.json(xlData)
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(Port, function () {
  console.log("Server is runing on :" + Port);
});


module.exports = app;
