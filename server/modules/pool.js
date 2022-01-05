const pg = require('pg');

// create "pool" connection to database
const pool = new pg.Pool({
    // database name
    database: 'jazzy_sql'
});

module.exports = pool;