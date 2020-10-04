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
  return db.createTable('room_users', {
    id: { type: 'bigserial', primaryKey: true, autoIncrement: true, notNull: true },
    room_id: {
      type: 'bigint',
      notNull: true,
      foreignKey: {
        name: 'room_users_room_id_fkey',
        table: 'rooms',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
      }
    },
    user_id: {
      type: 'int',
      foreignKey: {
        name: 'room_users_user_id_fkey',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
      }
    },
  });
};

exports.down = function(db) {
  return db.removeForeignKey('room_users', 'room_users_room_id_fkey', () => (
    db.removeForeignKey('room_users', 'room_users_user_id_fkey', () => (
      db.dropTable('room_users')
    ))
  ));
};

exports._meta = {
  "version": 1
};
