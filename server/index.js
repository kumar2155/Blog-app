const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth.js");
const postRoutes = require("./routes/Post.js");

const app = express();

app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
