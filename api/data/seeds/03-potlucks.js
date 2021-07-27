exports.seed = function (knex) {
  return knex("potlucks").insert([
    {
      potluck_name: "cookout",
      organizer_id: 1,
    },
    {
      potluck_name: "backyard hang",
      organizer_id: 2,
    },
  ]);
};
