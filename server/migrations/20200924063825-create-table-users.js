'use strict';

const { text } = require("body-parser");

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('users', {
    id: { type: 'bigserial', primaryKey: true, autoIncrement: true, notNull: true },
    name: 'text',
    lastname: 'text',
    login: { type: 'text', unique: true, notNull: true },
    password: 'text',
    deleted: { type: 'boolean', defaultValue: false },
    created_at: { type: 'timestamp', defaultValue: new String('now()') },
    updated_at: { type: 'timestamp' },
  }, () => {
    db.runSql(`
      CREATE EXTENSION if not exists pgcrypto;
      insert into users (name, lastname, login, password) values ('Владислав', 'Анохин', 'anoha', crypt('111111', gen_salt('bf', 8)))
    `)
  });
};

exports.down = function(db) {
  return db.dropTable('users', () => {
    db.runSql(`
      drop extension pgcrypto;
    `);
  });
};

exports._meta = {
  "version": 1
};
