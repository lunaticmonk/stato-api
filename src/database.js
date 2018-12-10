'use strict';

const knexConfig = require('./knexfile');
const { development } = knexConfig;

const knex = require('knex')(development);

module.exports = require('bookshelf')(knex);