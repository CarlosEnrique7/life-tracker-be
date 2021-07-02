const express = require("express");
const Exercise = require("../models/exercise");
const security = require("../middleware/security");
const router = express.Router();

router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const { data } = req.body;
    const exercise = await Exercise.addExercise({ user, data });
    return res.status(200).json({ exercise });
  } catch (err) {
    next(err);
  }
});

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const exercise = await Exercise.listAllExercises({ user });
    return res.status(200).json({ exercise });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
