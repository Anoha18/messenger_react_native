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
  return db.createTable('files', {
    id: { type: 'bigserial', primaryKey: true, autoIncrement: true, notNull: true },
    file_name: 'text',
    file_path: 'text',
    mime_type: 'text',
    type: 'text',
    creator_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'file_creator_id_user_id_fkey',
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
  });
};

exports.down = function(db) {
  return db.removeForeignKey('files', 'file_creator_id_user_id_fkey', () => {
    db.dropTable('files')
  });
};

exports._meta = {
  "version": 1
};
