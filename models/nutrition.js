const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Nutrition {
  static async addCalories({ user, data }) {
    const query = `
      INSERT INTO food(name,category,quantity,calories,user_id) VALUES ($1, $2, $3, $4,(select id from users WHERE users.email = $5)) RETURNING name, category, quantity, calories;
      `;
    const result = await db.query(query, [data.name, data.category, data.quantity, data.calories, user.email]);

    return result.rows[0];
  }

  static async listAllCalories({ user }) {
    const query = `
    SELECT name, category, quantity, calories, timestamp
      FROM food 
      WHERE user_id = (SELECT id FROM users WHERE users.email = $1)
      ORDER BY timestamp ASC
    `;
    const result = await db.query(query, [user.email]);

    return result.rows;
  }
}

module.exports = Nutrition;
