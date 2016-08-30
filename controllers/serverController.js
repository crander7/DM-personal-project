const app = require('../server.js');
const db = app.get('db');

module.exports = {

        getStatus: (req, res, next) => {
            if (req.query.status) {
                db.read_start_values([req.query.status], (err, values) => {
                    res.json(values);
                });
            }
            else {
                res.sendStatus(404);
            }
        },
        //for client
        getBracket: (req, res, next) => {
            if (req.query.first) {
                db.read_tax_brackets([req.query.first, req.query.second, req.query.third, req.query.status], (err, values) => {
                    res.json(values);
                });
            }
            else {
                res.sendStatus(404);
            }
        },
        //for admin
        getBrackets: (req, res, next) => {
            db.get_bracket([req.params.status], (err, response) => {
                res.json(response);
            });
        }

};
