'use strict';

const bookshelf = require('../bookshelf');

const Organization = bookshelf.Model.extend({
  tableName: 'organizations',
});