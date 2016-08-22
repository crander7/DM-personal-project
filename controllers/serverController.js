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
                res.statusCode(404);
            }
        }

};
