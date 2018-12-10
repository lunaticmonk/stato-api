'use strict';

const Bookshelf = require('../database');

const User = Bookshelf.Model.extend({
  tableName: 'users',
});

module.exports = Bookshelf.Model('User', 'User');