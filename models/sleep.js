const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Sleep {
  static async addSleep({ user, data }) {
    const query = `
      INSERT INTO sleep(start_time,end_time,duration,user_id) VALUES ($1, $2, ($2 - $1),(select id from users WHERE users.email = $3)) RETURNING start_time, end_time, duration;
      `;
    const result = await db.query(query, [data.startTime, data.endTime, user.email]);

    return result.rows[0];
  }

  static async listAllSleep({ user }) {
    const query = `
    SELECT start_time, end_time, duration, timestamp
      FROM sleep 
      WHERE user_id = (SELECT id FROM users WHERE users.email = $1)
      ORDER BY timestamp ASC
    `;
    const result = await db.query(query, [user.email]);

    return result.rows;
  }
}

module.exports = Sleep;
