const express = require('express')
const app = express();
const router = require("../routes/index");
const bodyParser = require('body-parser');

require('dotenv').config();

const PORT_TEST = process.env.TEST;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use(router);



const server = app.listen(PORT_TEST, () => {})


module.exports = { app, server };