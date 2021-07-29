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
  let newPotluckResult = newPotluck;
  let foodInsert = [];
  let inviteInsert = [];

  const addInvites = async () => {
    if (potluck.invites.length > 0) {
      for (const user of potluck.invites) {
        const [findUser] = await db("users").where("user_id", user);
  
        await db("potluck_invites").insert(
          { potluck_id: newPotluck.potluck_id, user_id: findUser.user_id },
          ["potluck_id", "user_id"]
        );
  
        inviteInsert.push(findUser.username);
      }
      newPotluckResult = {
        ...newPotluckResult,
        invites: inviteInsert,
      };
      console.log('look here')
    } else {
      newPotluckResult = {
        ...newPotluckResult,
        invites: []
      }
    }
  }

  if (potluck.food.length > 0) {
    for (const el of potluck.food) {
      const food = el.trim();
      let newFood = {
        food_id: null,
        food_name: "",
      };
      const [findFood] = await db("foods").where("food_name", food);

      if (findFood) {
        newFood.food_id = findFood.food_id;
        newFood.food_name = findFood.food_name;
      } else {
        const [addFood] = await db("foods").insert({food_name: food}, [
          "food_id",
          "food_name",
        ]);
        
        newFood.food_id = addFood.food_id;
        newFood.food_name = addFood.food_name;
      }

      await db("potluck_food_users").insert(
        { potluck_id: newPotluck.potluck_id, food_id: newFood.food_id },
        ["potluck_id", "food_id"]
      );

      foodInsert.push(newFood.food_name);
    }
    newPotluckResult = {
      ...newPotluckResult,
      food: foodInsert,
    };
    await addInvites();
    console.log(newPotluckResult);
  } else {
    newPotluckResult = {
      ...newPotluckResult,
      food: []
    }
    await addInvites();
  } 
  return newPotluckResult;
}

module.exports = {
  getUserPotlucks,
  getUserInvites,
  getPotluckFood,
  addPotluck,
};
