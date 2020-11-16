/* TODO --

[SECURITE]
    1/ Priorité au module d'authentification OWASP#5 - Contrôle des accès aux données utilisateurs

*/

const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const sauceCtrl = require('../controllers/sauceControllers');

router.post('/:id/like', auth, sauceCtrl.voteSauce);

router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', sauceCtrl.getOneSauce);
router.get('/', sauceCtrl.getAllSauces);

module.exports = router;