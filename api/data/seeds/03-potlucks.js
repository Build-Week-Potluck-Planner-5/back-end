exports.seed = function (knex) {
  return knex("potlucks").insert([
    {
      potluck_name: "cookout",
      potluck_date: "August 1",
      potluck_time: "3pm",
      organizer_id: 1,
      potluck_location: "park",
    },
    {
      potluck_name: "backyard hang",
      potluck_date: "July 30",
      potluck_time: "8pm",
      organizer_id: 2,
      potluck_location: "backyard",
    },
  ]);
};
