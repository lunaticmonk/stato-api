'use strict';

const db = require('../database');

const Organization = db.Model.extend({
  tableName: 'organizations',
  hasTimestamps: true,
  idAttribute: null
});

module.exports = Organization;