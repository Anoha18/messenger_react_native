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
  return db.createTable('rooms', {
    id: { type: 'bigserial', primaryKey: true, autoIncrement: true, notNull: true },
    name: 'text',
    type_id: {
      type: 'int',
      foreignKey: {
        name: 'room_type_id_fkey',
        table: 'room_types',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
      }
    },
    creator_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'room_creator_id_fkey',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
      }
    },
    deleted: { type: 'boolean', defaultValue: false },
    created_at: { type: 'timestamp', defaultValue: new String('now()') },
    updated_at: { type: 'timestamp' },
  });
};

exports.down = function(db) {
  return db.removeForeignKey('rooms', 'room_type_id_fkey', () => (
    db.removeForeignKey('rooms', 'room_creator_id_fkey', () => (
      db.dropTable('rooms')
    ))
  ));
};

exports._meta = {
  "version": 1
};
