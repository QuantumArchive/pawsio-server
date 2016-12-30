const router = require('express').Router();
const bodyParser = require('body-parser').json();

router
    .get('/', bodyParser, (req, res, next) => {
        
    })
    .put('/', bodyParser, (req, res, next) => {

    })
    .post('/', bodyParser, (req, res, next) => {

    })
    .delete('/', bodyParser, (req, res, next) => {

    });

module.exports = router;
