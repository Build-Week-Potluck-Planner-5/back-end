exports.up = async (knex) => {
  await knex.schema
    .createTable("users", (table) => {
      table.increments("user_id");
      table.string("username", 200).notNullable().unique();
      table.string("password", 200).notNullable();
      table.string("first_name", 200);
      table.string("last_name", 200);
      table.timestamps(false, true);
    })
    .createTable("potlucks", (table) => {
      table.increments("potluck_id");
      table.string("potluck_name", 200).notNullable();
      table.string("potluck_date").notNullable();
      table.string("potluck_time").notNullable();
      table
        .integer("organizer_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");
      table.timestamps(false, true);
    })
    .createTable("potluck_attendees", (table) => {
      table.increments("potluck_attendee_id");
      table
        .integer("potluck_id")
        .unsigned()
        .notNullable()
        .references("potluck_id")
        .inTable("potlucks")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");
      table.timestamps(false, true);
    })
    .createTable("foods", (table) => {
      table.increments("food_id");
      table.string("food_name").notNullable().unique();
      table.timestamps(false, true);
    })
    .createTable("potluck_food_users", (table) => {
      table.increments("potluck_food_user_id");
      table
        .integer("potluck_id")
        .unsigned()
        .notNullable()
        .references("potluck_id")
        .inTable("potlucks")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");
      table
        .integer("food_id")
        .unsigned()
        .notNullable()
        .references("food_id")
        .inTable("foods")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");
      table
        .integer("user_id")
        .unsigned()
        .defaultTo(null)
        .references("user_id")
        .inTable("users")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");
    });
};

exports.down = async (knex) => {
  await knex.schema
    .dropTableIfExists("potluck_food_users")
    .dropTableIfExists("foods")
    .dropTableIfExists("potluck_attendees")
    .dropTableIfExists("potlucks")
    .dropTableIfExists("users");
};
