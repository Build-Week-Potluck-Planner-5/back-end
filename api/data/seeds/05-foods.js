exports.seed = function (knex) {
  return knex("foods").insert([
    {
      food_name: "hamburgers",
    },
    {
      food_name: "potato salad",
    },
    {
      food_name: "watermelon",
    },
  ]);
};
