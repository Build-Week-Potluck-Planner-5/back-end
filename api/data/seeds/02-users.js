exports.seed = function (knex) {
  return knex("users").insert([
    {
      username: "foobar",
      password: "1234",
      first_name: "foo",
      last_name: "bar",
    },
    {
      username: "fizzbuzz",
      password: "1234",
      first_name: "fizz",
      last_name: "buzz",
    },
    {
      username: "johndoe",
      password: "1234",
      first_name: "john",
      last_name: "doe",
    },
  ]);
};
