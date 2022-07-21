import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnect from "./app/database";
import { models } from "./app/models";
import { tutorialRoutes } from "./app/routes/tutorial.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// require database connection
dbConnect();
// add db models as a middleware and make it available to all routes
app.use((req, res, next) => {
  req.context = {
    models,
  };
  // console.log(req.context);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.use("/api/tutorials", tutorialRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
