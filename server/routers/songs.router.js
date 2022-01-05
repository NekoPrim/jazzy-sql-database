const pg = require('pg');
const express = require('express');
const songsRouter = express.Router();

// create "pool" connection to database
const pool = new pg.Pool({
    // database name
    database: 'jazzy_sql'
});


songsRouter.get('/', (req, res) => {
    console.log(`In /song GET`);
    // res.send(artistList); dont need
    
    // make a sql query string
    const queryText = 'SELECT * FROM songs ORDER BY title;';
    // send sql query to database
    pool.query(queryText)
        .then((dbRes) => {
            console.log(dbRes.rows);
            // send data back to the client
            res.send(dbRes.rows);
        })
        .catch((err) => {
            console.log('GET /song failed!', err);
            // tell client of failure
            res.sendStatus(500);
        })
});



songsRouter.post('/', (req, res) => {
    // artistList.push(req.body); no
    // res.sendStatus(201); no
    console.log('req.body is', req.body);

    // safeguard database from client input
    let queryText = `
        INSERT INTO "songs"
            ("title", "length", "released")
        VALUES
            ($1, $2, $3)
    `;
    // define values of placeholders
    let queryParams = [
        req.body.title,
        req.body.length,
        req.body.released
    ];
    // check queryText
    console.log('queryText is', queryText);
    // "pool" connection to database
    pool.query(queryText, queryParams)
        .then((dbRes) => {
            // let client know of success
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('POST /song failed!');
            // tell client of failure
            res.sendStatus(500);
        })
});

module.exports = songsRouter;