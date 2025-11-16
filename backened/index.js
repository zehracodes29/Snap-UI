const express = require("express");
const cors = require("cors");
const geminiAPI = require("@google/generative-ai");
const genAI = new geminiAPI.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const UserRouter = require("./routers/Userrouter");
const ProjectRouter = require("./routers/Projectrouter");
const AIRouter = require("./routers/AIRouter");

require("dotenv").config();

const app = express();

const port = 5000;

//middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use(express.json());
app.use("/user", UserRouter);
app.use("/project", ProjectRouter);
app.use("/ai", AIRouter);

//endpoint or route
app.get("/", (req, res) => {
  res.send("response from express");
});

app.listen(port, () => {
  console.log("express server started ");
});
