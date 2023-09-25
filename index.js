const fs = require("node:fs/promises")
const path = require("node:path");
const bodyParser = require('body-parser'); 

const express = require("express");

const { usersRoutes, homeRoutes } = require("./routes");

const PORT = 8080;

const app = express();

const jsonParser = bodyParser.json();
const textParser = bodyParser.text(); 

app.use(jsonParser); 
app.use(textParser); 

app.use(express.urlencoded({extended: true}));


app.use('/', homeRoutes)
app.use('/users', usersRoutes)


app.listen(PORT, () => {
    console.log('Server is runnig...', PORT)
})