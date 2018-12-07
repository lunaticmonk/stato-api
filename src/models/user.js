'use strict';

const bookshelf = require('../bookshelf');

const User = bookshelf.Model.extend({
  tableName: 'users',
});