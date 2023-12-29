//jshint esversion:9
const express = require("express");
const cowController = require("./../controllers/cowController");

const router = express.Router();

router.get("/", cowController.recordCurrentData);
router.get("/all", cowController.getAll);

router.delete("/", cowController.deleteAll);
router
	.route("/:id")
	.get(cowController.getOne)
	.delete(cowController.deleteAnimal);

module.exports = router;
