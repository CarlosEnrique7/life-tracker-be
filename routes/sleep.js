const express = require("express");
const Sleep = require("../models/sleep");
const security = require("../middleware/security");
const router = express.Router();

router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const { data } = req.body;
    const sleep = await Sleep.addSleep({ user, data });
    return res.status(200).json({ sleep });
  } catch (err) {
    next(err);
  }
});

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const sleep = await Sleep.listAllSleep({ user });
    return res.status(200).json({ sleep });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
