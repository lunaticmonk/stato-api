'use strict';

const db = require('../database');

const User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  idAttribute: null
});

// module.exports = db.Model('User', User);
module.exports = User;