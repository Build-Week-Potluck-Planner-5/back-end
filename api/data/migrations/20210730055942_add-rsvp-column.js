exports.up = async function (knex) {
  await knex.schema.table("potluck_invites", function (table) {
    table.boolean("rsvp").defaultTo(false);
  });
};

exports.down = async function (knex) {
  await knex.schema.table("potluck_invites", function (table) {
    table.dropColumn("rsvp");
  });
};
