const db = require("../data/db-config");

function findById(user_id) {
  return db("users").where("user_id", user_id).first();
}

function findBy(filter) {
  return db("users").where(filter);
}

async function add(user) {
  const [newUser] = await db("users").insert(user, [
    "user_id",
    "username",
    "password",
    "first_name",
  ]);
  return newUser;
}

module.exports = {
  findById,
  findBy,
  add,
};
