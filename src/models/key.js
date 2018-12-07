'use strict';

const bookshelf = require('../bookshelf');

const Key = bookshelf.Model.extend({
  tableName: 'keys',
});