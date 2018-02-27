const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const app = module.exports = express();
const massive = require('massive');
const config = require('./config.js');
const connectStr = config.connString;
const massiveInstance = massive.connectSync({connectionString: connectStr});
app.set('db', massiveInstance);
const taxCode = require('./controllers/serverController.js');
const users = require('./controllers/userController.js');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const db = app.get('db');

var requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

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
    users.findOrCreate(profile); //Where does this go?
    return done(null, profile);
}));

//************************************* Endpoints *********************************************//

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/login',
    failureRedirect: '/auth/facebook'
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.get('/login', requireAuth, (req, res, next) => {
    res.redirect('/#/admin');
});
app.get('/me', requireAuth, users.checkAuth);

//for client side
app.get('/tax-data', taxCode.getStatus);
app.get('/tax-data/brackets/', taxCode.getBracket);
//for admin
app.get('/brackets/:status', taxCode.getBrackets);
app.get('/user/:name', users.getUser);

app.put('/user', users.updateUser);

app.listen(config.port, () => {
  console.log("Listening on port:", config.port);
});
