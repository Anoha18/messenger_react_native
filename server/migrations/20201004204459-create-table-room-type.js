'use strict';

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
  return db.createTable('room_types', {
    id: { type: 'serial', primaryKey: true, autoIncrement: true, notNull: true },
    brief: { type: 'text', unique: true, notNull: true },
    name: 'text'
  }, () => {
    db.runSql(`
      insert into room_types (brief, name) values
      (upper('private'), 'Приватный'),
      (upper('conversation'), 'Беседа');
    `)
  });
};

exports.down = function(db) {
  return db.dropTable('room_types');
};

exports._meta = {
  "version": 1
};
