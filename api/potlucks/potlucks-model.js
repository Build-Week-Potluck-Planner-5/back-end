const db = require("../data/db-config");

function getUserAttending(user_id) {
  return db("potlucks as p")
    .join("potluck_invites as pi", "p.potluck_id", "pi.potluck_id")
    .join("users as u", "p.organizer_id", "u.user_id")
    .select(
      "p.potluck_name",
      "p.potluck_date",
      "p.potluck_time",
      "u.username as organizer"
    )
    .where("pi.user_id", user_id)
    .andWhere("pi.attending", true);
}

function getUserInvites(user_id) {
  return db("potlucks as p")
    .join("potluck_invites as pi", "p.potluck_id", "pi.potluck_id")
    .join("users as u", "p.organizer_id", "u.user_id")
    .select(
      "p.potluck_name",
      "p.potluck_date",
      "p.potluck_time",
      "u.username as organizer"
    )
    .where("pi.user_id", user_id)
    .andWhere("pi.attending", false);
}

async function getPotluckFood(potluck_id) {
  const rows = await db("potlucks as p")
    .join("users as u", "p.organizer_id", "u.user_id")
    .leftJoin("potluck_food_users as pfu", "pfu.potluck_id", "p.potluck_id")
    .leftJoin("foods as f", "pfu.food_id", "f.food_id")
    .leftJoin("users as us", "pfu.user_id", "us.user_id")
    .select(
      "p.potluck_id",
      "p.potluck_name",
      "p.potluck_date",
      "p.potluck_time",
      "p.potluck_location",
      "p.organizer_id",
      "u.username as organizer",
      "pfu.food_id",
      "f.food_name",
      "pfu.user_id",
      "us.username"
    )
    .where("p.potluck_id", potluck_id);
  
  const potluck = rows[0];

  let result = {
    potluck_id: potluck.potluck_id,
    potluck_name: potluck.potluck_name,
    potluck_date: potluck.potluck_date,
    potluck_time: potluck.potluck_time,
    potluck_location: potluck.potluck_location,
    organizer_id: potluck.organizer_id,
    organizer: potluck.organizer,
    food: [],
  };

  rows.forEach((el) => {
    result.food.push({
      food_id: el.food_id,
      food_name: el.food_name,
      user_id: el.user_id,
      username: el.username,
    });
  });
  return result;
}

module.exports = {
  getUserAttending,
  getUserInvites,
  getPotluckFood,
};
