const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.set('port', 3000);

app.get("/hi", (req, res)=>{
    res.send("hi");
});

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log("http://localhost:" + app.get('port'));
});