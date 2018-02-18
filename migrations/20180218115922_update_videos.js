
exports.up = function(knex, Promise) {
  return knex.transaction((t) => {
    return t.raw(
      `UPDATE videos
        SET url = 'PR8s2ue3rhA'
        WHERE url = 'aG_OLL9mt1c'
      `
    )
  })
};

exports.down = function(knex, Promise) {

};
