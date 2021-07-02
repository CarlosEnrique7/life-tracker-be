const express = require("express");
const Activity = require("../models/activity");
const security = require("../middleware/security");
const router = express.Router();

router.get("/exercise", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const exercise = await Activity.listAvgExercises({ user });
    return res.status(200).json({ exercise });
  } catch (err) {
    next(err);
  }
});
router.get("/calories", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const calories = await Activity.listAvgCalories({ user });
    return res.status(200).json({ calories });
  } catch (err) {
    next(err);
  }
});
router.get("/sleep", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const sleep = await Activity.listAvgSleep({ user });
    return res.status(200).json({ sleep });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
