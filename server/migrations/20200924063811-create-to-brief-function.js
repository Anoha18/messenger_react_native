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
  return db.runSql(`
    create or replace function to_brief(txt text) returns text
    language sql
    as
      $$
      select
          replace(
          replace(
          replace(
          replace(
          replace(
          replace(
          replace(
          replace(
          replace(
          replace(
          replace(
          replace(
          replace(
          translate(lower($1),
          'абвгдезийклмнопрстуфц', 'abvgdezijklmnoprstufc'),
          'ж', 'zh'),
          'ч', 'ch'),
          'ш', 'sh'),
          'щ', 'shh'),
          'ъ', ''),
          'ы', 'y'),
          'э', 'eh'),
          'ю', 'yu'),
          'я', 'ya'),
          'ё', 'yo'),
          '', ''),
          ' ', '_'),
          'х', 'kh');
      $$;
  `);
};

exports.down = function(db) {
  return db.runSql(`
    drop function to_brief(txt text);
  `);
};

exports._meta = {
  "version": 1
};
