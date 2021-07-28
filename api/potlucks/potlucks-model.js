const db = require("../data/db-config");

function get() {
  return db("potlucks as p")
    .join('users as u', 'p.organizer_id', 'u.user_id')
    .select('p.potluck_name', 'p.potluck_date', 'p.potluck_time', 'u.username as organizer');
}

module.exports = {
  get,
};
