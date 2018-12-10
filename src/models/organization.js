'use strict';

const Bookshelf = require('../database');

const Organization = Bookshelf.Model.extend({
  tableName: 'organizations',
});

module.exports = Bookshelf.Model('Organization', 'Organization');