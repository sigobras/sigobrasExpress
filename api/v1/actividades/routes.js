const express = require("express");
const router = express.Router();
const controller = require("./controllers");

router.get("/", controller.getAllActivities);
router.get("/:id", controller.getActivityById);
router.post("/", controller.createActivity);
router.put("/:id", controller.updateActivity);
router.delete("/:id", controller.deleteActivity);
router.post("/newByType", controller.createNewByType);

module.exports = router;
