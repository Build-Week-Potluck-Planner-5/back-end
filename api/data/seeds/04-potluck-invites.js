exports.seed = function (knex) {
  return knex("potluck_invites").insert([
    {
      potluck_id: 1,
      user_id: 1,
      attending: true,
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
