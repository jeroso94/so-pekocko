const fs = require('fs');
const Sauce = require('../models/sauceModels');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json( sauces ))
        .catch((error) => res.status(404).json({ error: error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json( sauce ))
        .catch((error) => res.status(404).json({ error: error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log (sauceObject);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userliked: [],
        userdisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...req.body.sauce,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(405).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })           
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(404).json({ error }));
};

exports.voteSauce = (req, res, next) => { 
    const status = req.body.like;
    const userId = req.body.userId;

    console.log ("ID de sauce recherché : " + req.params.id + " - " + "status: " + status + " - " + "userId: " + userId);

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log(sauce);
            const index = [sauce.usersLiked.indexOf(userId), sauce.usersDisliked.indexOf(userId)];
            console.log ("Recherche vote userLiked : " + index[0] + " - " + "Recherche vote userDisliked : " + index[1]);


            switch (status) {
                // J'aime
                case 1:
                    console.log("J'aime")
                    // Enregistrement du like, si l'utilisateur n'a pas encore voté
                    if (index[0] == -1){

                        Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: 1 }})
                            .then(() => res.status(200).json({ message: 'Like ajouté !'}))
                            .catch(error => res.status(418).json({ error }));

                        // Sortir du comptage le dislike de l'utilisateur, si présent
                        if (index[1] >= 0){

                            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                                .then(() => res.status(204).json({ message: ''}))
                                .catch(error => res.status(418).json({ error }));
                        }
                    } else {
                            res.status(200).json({ message: 'Aucun objet modifié !'});
                    }
                    break;

                // J'aime pas
                case -1:
                    console.log("J'aime pas")
                    // Enregistrement du dislike, si l'utilisateur n'a pas encore voté
                    if (index[1] == -1){
                        console.log("Enregistrement du dislike, si l'utilisateur n'a pas encore voté");
                        Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 }})
                            .then(() => res.status(200).json({ message: 'Dislike ajouté !'}))
                            .catch(error => res.status(418).json({ error }));

                        // Sortir du comptage le like de l'utilisateur, si présent
                        if (index[0] >= 0){

                            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                                .then(() => res.status(204).json({ message: ''}))
                                .catch(error => res.status(418).json({ error }));
                        }
                    } else {
                            res.status(200).json({ message: 'Aucun objet modifié !'});
                    }
                    break;

                    // "Sans opinion" (comme déclaré par Mr François B. de Bagnère-de-bigorre)
                    case 0:
                        console.log("Sans opinion")
                        // Sortir du comptage le dislike de l'utilisateur, si présent
                        if (index[1] >= 0){

                            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                                .then(() => res.status(200).json({ message: 'Dislike soustrait !'}))
                                .catch(error => res.status(418).json({ error }));
                        
                        }

                        // Sortir du comptage le like de l'utilisateur, si présent
                        if (index[0] >= 0){

                            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                                .then(() => res.status(200).json({ message: 'Like soustrait !'}))
                                .catch(error => res.status(418).json({ error }));
                        }
                        break;
                default:
                    break;
            }
        })
        .catch(error => res.status(404).json({ error }));
};
    
