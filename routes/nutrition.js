const express = require("express");
const Nutrition = require("../models/nutrition");
const security = require("../middleware/security");
const router = express.Router();

router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const { data } = req.body;
    const calories = await Nutrition.addCalories({ user, data });
    return res.status(200).json({ calories });
  } catch (err) {
    next(err);
  }
});

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const calories = await Nutrition.listAllCalories({ user });
    return res.status(200).json({ calories });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
