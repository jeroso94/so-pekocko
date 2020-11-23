/* TODO --
[SECURITE]
    1/ ENVISAGER l'anonymisation OWASP#3 -  Lutter contre l'exposition des données sensibles
        a) module mongo-mask

    2/ HEAT : Restreindre la plage de nombre autorisé dans ce champ (entre 1 et 10)

*/

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//const mongoMask = require('mongo-mask')

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    description: { type: String },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
});

sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('sauce', sauceSchema);