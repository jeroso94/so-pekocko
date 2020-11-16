/* TODO --

[SECURITE]
    1/ OWASP#2 - Lutter contre piratage de session
        ...
        b) COOKIES - Transmettre via le HEADER des requêtes POST/GET
*/

/* DONE
[DATABASE]
    1/ Configurer la connexion à la collection

[SECURITE]
    1/ OWASP#2 - Lutter contre piratage de session
        a) REVISER le CORS
    2/ ENVISAGER l'anonymisation OWASP#3 -  Lutter contre l'exposition des données sensibles
        a) module mongo-mask
        b) REVISER les privilèges GUEST
*/

const mongoose = require ('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const helmet = require("helmet");
//const mongoMask = require('mongo-mask')

const userRoutes = require('./routes/userRoutes');
const sauceRoutes = require('./routes/sauceRoutes');

mongoose.connect('mongodb+srv://guest:YaA90y7bmbJUqDrN@cluster0.uvwfz.mongodb.net/so_pekocko?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // OWASP#2 - Lutter contre piratage de session
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // ORIGINAL - 
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;