const db = require("../data/db-config");

const get = () => {
  return db('users')
}

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
    "first_name",
  ]);
  return newUser;
}

// async function insertUser(user) {
//   // WITH POSTGRES WE CAN PASS A "RETURNING ARRAY" AS 2ND ARGUMENT TO knex.insert/update
//   // AND OBTAIN WHATEVER COLUMNS WE NEED FROM THE NEWLY CREATED/UPDATED RECORD
//   // UNLIKE SQLITE WHICH FORCES US DO DO A 2ND DB CALL
//   const [newUserObject] = await db('users').insert(user, ['user_id', 'username', 'password'])
//   return newUserObject // { user_id: 7, username: 'foo', password: 'xxxxxxx' }
// }

module.exports = {
  findById,
  findBy,
  add,
  get,
};
