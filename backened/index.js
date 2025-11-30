require("dotenv").config();

const express = require("express");
const cors = require("cors");
const geminiAPI = require("@google/generative-ai");

const genAI = new geminiAPI.GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const UserRouter = require("./routers/Userrouter");
const ProjectRouter = require("./routers/Projectrouter");
const AIRouter = require("./routers/AIRouter");

const app = express();
const port = 4000;

/* ------------------ CORS CONFIG ------------------ */

app.use(cors({
  origin: "http://localhost:3000",     // Next.js frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Fix OPTIONS / preflight issues
// app.options("*", cors());

/* --------------------------------------------------- */

app.use(express.json());

/* ------------------ ROUTES ------------------ */

app.use("/user", UserRouter);       // /user/*
app.use("/project", ProjectRouter); // /project/*
app.use("/ai", AIRouter);           // /ai/*

app.get("/", (req, res) => {
  res.send("response from express");
});

/* ------------------ START SERVER ------------------ */

app.listen(port, () => {
  console.log(`Express server started on port ${port}`);
});
