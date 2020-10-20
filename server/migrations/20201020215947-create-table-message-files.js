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
  return db.createTable('message_files', {
    id: { type: 'bigserial', primaryKey: true, autoIncrement: true, notNull: true },
    message_id: {
      type: 'bigint',
      notNull: true,
      foreignKey: {
        name: 'message_files_message_id_fkey',
        table: 'messages',
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
        name: 'message_files_file_id_fkey',
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
  return db.removeForeignKey('message_files', 'message_files_message_id_fkey', () => (
    db.removeForeignKey('message_files', 'message_files_file_id_fkey', () => (
      db.dropTable('message_files')
    ))
  ));
};

exports._meta = {
  "version": 1
};
