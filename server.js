const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const app = module.exports = express();
const massive = require('massive');
const connectStr = "postgres://postgres:craig@localhost/test8";
const massiveInstance = massive.connectSync({connectionString: connectStr});
app.set('db', massiveInstance);
const taxCode = require('./controllers/serverController.js');
const config = require('./config.js');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
passport.use(new FacebookStrategy({
  clientID: config.facebookAppID,
  clientSecret: config.facebookSecret,
  callbackURL: `http://localhost:${config.port}/auth/facebook/callback`
}, (token, refreshToken, profile, done) => {
  return done(null, profile);
}));
//************************************* Endpoints *********************************************//

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/me',
    failureRedirect: '/login'
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/me', (req, res, next) => {
    res.json(req.user);
});

app.get('/tax-data', taxCode.getStatus);
app.get('/tax-data/brackets', taxCode.getBracket);

app.listen(config.port, () => {
  console.log("Listening on port:", config.port);
});
