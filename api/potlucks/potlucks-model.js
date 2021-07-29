const db = require("../data/db-config");

function getUserPotlucks(user_id) {
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

async function addPotluck(potluck) {
  const potluckInsert = {
    potluck_name: potluck.potluck_name,
    potluck_date: potluck.potluck_date,
    potluck_time: potluck.potluck_time,
    potluck_location: potluck.potluck_location,
    organizer_id: potluck.organizer_id,
  };

  const [newPotluck] = await db("potlucks").insert(potluckInsert, [
    "organizer_id",
    "potluck_id",
    "potluck_name",
    "potluck_date",
    "potluck_time",
    "potluck_location",
  ]);
  console.log(newPotluck);
  let newPotluckResult = newPotluck;
  let foodInsert = [];

  if (potluck.food.length > 0) {
    for (const food of potluck.food) {
      let newFood = {
        food_id: null,
        food_name: "",
      };
      const [findFood] = await db("foods").where("food_name", food);
      console.log('findFood', findFood);

      if (findFood) {
        newFood.food_id = findFood.food_id;
        newFood.food_name = findFood.food_name;
        console.log('findFood', findFood)
      } else {
        const [addFood] = await db("foods").insert({food_name: food}, [
          "food_id",
          "food_name",
        ]);
        console.log('addFood', addFood);
        
        newFood.food_id = addFood.food_id;
        newFood.food_name = addFood.food_name;
      }
      console.log('food_id', newFood.food_id);

      const potluckFoodUser = await db("potluck_food_users").insert(
        { potluck_id: newPotluck.potluck_id, food_id: newFood.food_id },
        ["potluck_id", "food_id"]
      );
      console.log(potluckFoodUser);

      foodInsert.push(newFood.food_name);
      // if food isn't in food table, add it to the food table and return the new object
      // if food is in the food table, then grab the food id
      // insert a new record in potluck_food_users with the newPotluck.potluck_id and the newFood.food_id
      // push the name of the food to the foodInsert array
    }
    newPotluckResult = {
      ...newPotluckResult,
      food: foodInsert,
    };
  }
  return newPotluckResult;
}

module.exports = {
  getUserPotlucks,
  getUserInvites,
  getPotluckFood,
  addPotluck,
};
