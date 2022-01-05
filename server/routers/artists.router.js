const pg = require('pg');
const express = require('express');
const artistsRouter = express.Router();

// create "pool" connection to database
const pool = new pg.Pool({
    // database name
    database: 'jazzy_sql'
});


artistsRouter.get('/', (req, res) => {
    console.log(`In /artist GET`);
    // res.send(artistList); dont need
    
    // make a sql query string
    const queryText = 'SELECT * FROM artists ORDER BY year_born DESC;';
    // send sql query to database
    pool.query(queryText)
        .then((dbRes) => {
            console.log(dbRes.rows);
            // send data back to the client
            res.send(dbRes.rows);
        })
        .catch((err) => {
            console.log('GET /artist failed!', err);
            // tell client of failure
            res.sendStatus(500);
        })
});



artistsRouter.post('/', (req, res) => {
    // artistList.push(req.body); no
    // res.sendStatus(201); no
    console.log('req.body is', req.body);

    // safeguard database from client input
    let queryText = `
        INSERT INTO "artists"
            ("artist_name", "year_born")
        VALUES
            ($1, $2)
    `;
    // define values of placeholders
    let queryParams = [
        req.body.artist_name,
        req.body.year_born
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
            console.log('POST /artist failed!');
            // tell client of failure
            res.sendStatus(500);
        })
});

module.exports = artistsRouter;