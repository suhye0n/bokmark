const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const register = require('./routes/register');
const login = require('./routes/login');
const bookmark = require('./routes/bookmark');
const withdraw = require('./routes/withdraw');

mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '몽고디비 연결 에러:'));
db.once('open', () => {
    console.log('몽고디비 연결');
});

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true,
}));
app.use(morgan('tiny'));
app.use('/', register);
app.use('/', login);
app.use('/', bookmark);
app.use('/', withdraw);

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log(`http://127.0.0.1:${app.get('port')}`);
});
