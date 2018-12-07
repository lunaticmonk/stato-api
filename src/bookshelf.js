'use strict';

require('dotenv').config()

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME,
    charset  : 'utf8'
  }
});

module.exports = require('bookshelf')(knex);