const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const app = module.exports = express();
const massive = require('massive');
const connectStr = "postgres://postgres:craig@localhost/sandbox";
const massiveInstance = massive.connectSync({connectionString: connectStr});
app.set('db', massiveInstance);
const controller = require('./controllers/mainController.js');
const config = require('./config.js');



app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(__dirname + '/public'));

//Endpoints/////////////

app.listen(config.port, () => {
  console.log("Listening on port:", config.port);
});
