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
  return db.createTable('message_views', {
    id: { type: 'bigserial', primaryKey: true, autoIncrement: true, notNull: true },
    message_id: {
      type: 'bigint',
      notNull: true,
      foreignKey: {
        name: 'message_views_message_id_fkey',
        table: 'messages',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
      }
    },
    user_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'message_views_user_id_fkey',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
      }
    },
    created_at: { type: 'timestamp', defaultValue: new String('now()') },
  });
};

exports.down = function(db) {
  return db.removeForeignKey('message_views', 'message_views_message_id_fkey', () => (
    db.removeForeignKey('message_views', 'message_views_user_id_fkey', () => (
      db.dropTable('message_views')
    ))
  ));
};

exports._meta = {
  "version": 1
};
