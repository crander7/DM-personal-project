'use strict'
const app = require('../server.js');
const db = app.get('db');

module.exports = {

    findOrCreate: user => {
        db.get_user([user.id], (err, response) => {
            if (response.length == 0) {
                var type = "user";
                db.add_user([user.displayName, type, user.id], (err, response)  => {

                });
            }
        });
    },
    checkAuth: (req, res, next) => {
        db.get_user([req.user.id], (err, response) => {
            if (response.length == 0) {
                res.sendStatus(404);
            }
            else {
                res.json(response);
            }
        });
    },
    updateUser: (req, res, next) => {
        db.update_user([req.body.name, req.body.type, req.body.fb_id], (err, response) => {
            res.sendStatus(200);
        });
    },
    getUser: (req, res, next) => {
        let name = req.params.name.split(',').join(' ');
        db.get_user_by_name([name], (err, response) => {
            res.json(response);
        });
    }
};
