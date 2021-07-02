const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class User {
  static makePublicUser(user) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.is_admin,
      createdAt: user.created_at,
    };
  }

  static async login(credentials) {
    const requiredFields = ["email", "password"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });

    const user = await User.fetchUserByEmail(credentials.email);
    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (isValid) {
        return User.makePublicUser(user);
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }

  static async register(credentials) {
    const requiredFields = ["email", "password", "firstName", "lastName", "username", "isAdmin"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });

    if (credentials.email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email.");
    }

    const existingUserEmail = await User.fetchUserByEmail(credentials.email);
    if (existingUserEmail) {
      throw new BadRequestError(`A user already exists with email: ${credentials.email}`);
    }

    const existingUsername = await User.fetchUserByUsername(credentials.username);
    if (existingUsername) {
      throw new BadRequestError(`A user already exists with username: ${credentials.username}`);
    }

    const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR);
    const normalizedEmail = credentials.email.toLowerCase();
    const normalizedUsername = credentials.username.toLowerCase();

    const userResult = await db.query(
      `INSERT INTO users (first_name, last_name, username, email, password, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, first_name, last_name, username, email, is_admin, created_at;
      `,
      [
        credentials.firstName,
        credentials.lastName,
        normalizedUsername,
        normalizedEmail,
        hashedPassword,
        credentials.isAdmin,
      ]
    );
    const user = userResult.rows[0];

    return User.makePublicUser(user);
  }

  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided");
    }

    const query = `SELECT * FROM users WHERE email = $1`;

    const result = await db.query(query, [email.toLowerCase()]);

    const user = result.rows[0];

    return user;
  }

  static async fetchUserByUsername(username) {
    if (!username) {
      throw new BadRequestError("No username provided");
    }

    const query = `SELECT * FROM users WHERE username = $1`;

    const result = await db.query(query, [username.toLowerCase()]);

    const user = result.rows[0];

    return user;
  }
}

module.exports = User;
