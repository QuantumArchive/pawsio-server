const router = require('express').Router();
const bodyParser = require('body-parser').json();
const token = require('../auth/token');
const userModel = require('../models/user');
const ensureAuth = require('../auth/ensure-auth')();
const ensureRole = require('../auth/ensure-role');

router
    .post('/validate', ensureAuth, bodyParser, (req, res, next) => { //eslint-disable-line
        res.send({valid:true, username: req.user.user});
    })
    .post('/signup', bodyParser, (req, res, next) => {
        const {username, password, roles} = req.body;
        if (!username || !password) {
            return next({
                code: 400,
                error: 'Valid username and password required'
            });
        };

        if(roles || roles.length > 0) {
            return next({
                code: 400,
                error: 'user cannot designate role on signup'
            });
        };

        userModel
            .find({username})
            .count()
            .then(count => {
                if(count > 0) throw {code: 400, error: `Username ${username} already exists`};
                const user = new userModel(req.body);
                user.generateHash(password);
                return user.save();
            })
            .then(user => {
                return token.sign(user);
            })
            .then(token => {
                res.send({username, token});
            })
            .catch(next);
    })

    .post('/signin', bodyParser, (req, res, next) => {
        const {username, password} = req.body;
        delete req.body.password;

        userModel
            .findOne({username})
            .then(user => {
                if (!user || !user.compareHash(password)) throw {code: 400, error: 'Invalid username or password'};
                return token.sign(user);
            })
            .then(token => {
                res.send({username, token});
            })
            .catch(next);
    })

    .delete('/', ensureAuth, ensureRole(['admin']), bodyParser, (req, res, next) => {
        const {username} = req.body;
        const removedUser = {};
        userModel
            .findOne({username})
            .then(user => {
                return user.remove();
            })
            .then(user => {
                res.send({username,message:`${username} removed`});
            })
            .catch(next);
    });

module.exports = router;
