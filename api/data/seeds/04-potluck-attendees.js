exports.seed = function (knex) {
  return knex("potluck_attendees").insert([
    {
      potluck_id: 1,
      user_id: 1,
    },
    {
      potluck_id: 1,
      user_id: 2,
    },
    {
      potluck_id: 1,
      user_id: 3,
    },
    {
      potluck_id: 2,
      user_id: 2,
    },
    {
      potluck_id: 2,
      user_id: 3,
    },
  ]);
};
