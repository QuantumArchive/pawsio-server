const router = require('express').Router();
const bodyParser = require('body-parser').json();

router
    .get('/', bodyParser, (req, res, next) => {
        const message = 'hi from get';
        res.send({message});
    })
    .put('/', bodyParser, (req, res, next) => {
        const message = 'hi from put';
        res.send({message});
    })
    .post('/', bodyParser, (req, res, next) => {
        const message = 'hi from post';
        res.send({message});
    })
    .delete('/', bodyParser, (req, res, next) => {
        const message = 'hi from delete';
        res.send({message});
    });

module.exports = router;
