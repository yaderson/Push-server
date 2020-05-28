const Pool = require('pg').Pool

require('../config.js')


const pool = new Pool({
    connectionString: process.env.DATABASE_POSTGRES
})

module.exports = pool