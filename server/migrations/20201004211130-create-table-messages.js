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
  return db.createTable('messages', {
    id: { type: 'bigserial', primaryKey: true, autoIncrement: true, notNull: true },
    text: 'text',
    room_id: {
      type: 'bigint',
      notNull: true,
      foreignKey: {
        name: 'messages_room_id_fkey',
        table: 'rooms',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
      }
    },
    sender_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'sender_id_room_id_fkey',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
      }
    },
    parent_id: 'bigint',
    deleted: { type: 'boolean', defaultValue: false },
    created_at: { type: 'timestamp', defaultValue: new String('now()') },
    updated_at: { type: 'timestamp' },
  });
};

exports.down = function(db) {
  return db.removeForeignKey('messages', 'messages_room_id_fkey', () => (
    db.removeForeignKey('messages', 'sender_id_room_id_fkey', () => (
      db.dropTable('messages')
    ))
  ));
};

exports._meta = {
  "version": 1
};
