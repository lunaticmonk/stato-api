'use strict';

const db = require('../database');

const Organization = db.Model.extend({
  tableName: 'organizations'
});

module.exports = Organization;