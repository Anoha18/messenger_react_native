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
  return db.createTable('user_avatar', {
    id: { type: 'bigserial', primaryKey: true, autoIncrement: true, notNull: true },
    user_id: {
      type: 'bigint',
      notNull: true,
      foreignKey: {
        name: 'user_avatar_id_user_id_fkey',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
      }
    },
    file_id: {
      type: 'bigint',
      notNull: true,
      foreignKey: {
        name: 'user_avatar_file_id_fkey',
        table: 'files',
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
  return db.removeForeignKey('user_avatar', 'user_avatar_id_user_id_fkey', () => (
    db.removeForeignKey('user_avatar', 'user_avatar_file_id_fkey', () => (
      db.dropTable('user_avatar')
    ))
  ));
};

exports._meta = {
  "version": 1
};
