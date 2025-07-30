import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConfig.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to the LankaGrow");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}...`);
  dbConnect();
});
