const db = require("../data/db-config");

function getGuestPotlucks(user_id) {
  console.log("inside getUserPotlucks model function");
  return db("potlucks as p")
    .join("potluck_invites as pi", "p.potluck_id", "pi.potluck_id")
    .join("users as u", "p.organizer_id", "u.user_id")
    .select(
      "p.potluck_name",
      "p.potluck_date",
      "p.potluck_time",
      "u.username as organizer",
      "pi.potluck_invite_id"
    )
    .where("pi.user_id", user_id)
    .andWhere("pi.attending", true);
}

function getUserInvites(user_id) {
  return db("potlucks as p")
    .join("potluck_invites as pi", "p.potluck_id", "pi.potluck_id")
    .join("users as u", "p.organizer_id", "u.user_id")
    .select(
      "p.potluck_invite_id",
      "p.potluck_name",
      "p.potluck_date",
      "p.potluck_time",
      "u.username as organizer"
    )
    .where("pi.user_id", user_id)
    .andWhere("pi.attending", false);
}

async function findPotluckById(potluck_id) {
  const potluck = await db("potlucks").where("potluck_id", potluck_id);
  return potluck;
}

async function getPotluck(potluck_id) {
  const foodRows = await db("potlucks as p")
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

  const potluck = foodRows[0];

  let result = {
    potluck_id: potluck.potluck_id,
    potluck_name: potluck.potluck_name,
    potluck_date: potluck.potluck_date,
    potluck_time: potluck.potluck_time,
    potluck_location: potluck.potluck_location,
    organizer_id: potluck.organizer_id,
    organizer: potluck.organizer,
    food: [],
    invites: [],
  };
  foodRows.forEach((el) => {
    if (el.food_id) {
      result.food.push({
        food_id: el.food_id,
        food_name: el.food_name,
        user_id: el.user_id,
        username: el.username,
      });
    }
  });

  const guests = await db("potluck_invites as pu")
    .join("users as u", "pu.user_id", "u.user_id")
    .select("pu.user_id", "u.username", "pu.attending")
    .where("pu.potluck_id", potluck_id);
  result.invites = guests;

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
      console.log("look here");
    } else {
      newPotluckResult = {
        ...newPotluckResult,
        invites: [],
      };
    }
  };

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
        const [addFood] = await db("foods").insert({ food_name: food }, [
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
      food: [],
    };
    await addInvites();
  }
  return newPotluckResult;
}

async function organizerEditPotluck(info) {
  // client must send data with format:
  // {
  //   ...potluck_info,
  //   food: [...food],
  //   invites: [...invites]
  // }
  // overwrite all potluck info
  // for food, compare new array with old array
  // for new items in new array, insert into potluck_food_users. If completely new food, also insert into foods.
  // for old items not in new array, remove from potluck_food_users
  //
  // for invites, compare new array with old array
  // for new users in new array, insert into potluck_invites
  // for old users not in new array, remove from potluck_invites
}

async function organizerDeletePotluck() {}

async function guestUpdateFood(potluck_id, food_id, user_id) {
  const updatedPotluck = await db("potluck_food_users")
    .where("potluck_id", potluck_id)
    .andWhere("food_id", food_id)
    .update("user_id", user_id);
  return updatedPotluck;
}

async function guestCancelFood(potluck_id, food_id) {
  const updatedPotluck = await db("potluck_food_users")
    .where("potluck_id", potluck_id)
    .andWhere("food_id", food_id)
    .update("user_id", null);
  return updatedPotluck;
}

async function guestRSVP(response) {}

async function addFood(food) {}

function getAllFoods() {
  return db("foods").select("food_name");
}

module.exports = {
  getGuestPotlucks,
  getUserInvites,
  findPotluckById,
  getPotluck,
  addPotluck,
  guestUpdateFood,
  organizerEditPotluck,
  guestRSVP,
  addFood,
  organizerDeletePotluck,
  getAllFoods,
  guestCancelFood,
};
