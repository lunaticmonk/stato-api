'use strict';

const knexConfig = require('./knexfile');
const { development } = knexConfig;

const knex = require('knex')(development);
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');

module.exports = bookshelf;