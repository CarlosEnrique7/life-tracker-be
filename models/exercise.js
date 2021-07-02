const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Exercise {
  static async addExercise({ user, data }) {
    const query = `
      INSERT INTO exercises(name,category,duration,intensity,user_id) VALUES ($1, $2, $3, $4,(select id from users WHERE users.email = $5)) RETURNING name, category, duration, intensity;
      `;
    const result = await db.query(query, [data.name, data.category, data.duration, data.intensity, user.email]);

    return result.rows[0];
  }

  static async listAllExercises({ user }) {
    const query = `
    SELECT name, category, duration, intensity, timestamp
      FROM exercises 
      WHERE user_id = (SELECT id FROM users WHERE users.email = $1)
      ORDER BY timestamp ASC
    `;
    const result = await db.query(query, [user.email]);

    return result.rows;
  }
}

module.exports = Exercise;
