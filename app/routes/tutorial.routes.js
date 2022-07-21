import express from "express";
import * as tutorialController from "../controllers/tutorial.controller";
const router = express.Router();

// Create a new Tutorial
router.post("/", tutorialController.create);
// Retrieve all Tutorials
router.get("/", tutorialController.findAll);
// Retrieve all published tutorialController
router.get("/published", tutorialController.findAllPublished);
// Retrieve a single Tutorial with id
router.get("/:id", tutorialController.findOne);
// Update a Tutorial with id
router.put("/:id", tutorialController.update);
// Delete a Tutorial with id
router.delete("/:id", tutorialController.deleteOne);
// Create a new Tutorial
router.delete("/", tutorialController.deleteAll);

export { router as tutorialRoutes };
