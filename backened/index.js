const express = require("express");
const cors = require("cors");
const gemeiniAPI = require("@google/generative-ai");
const genAI = new gemeiniAPI.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const UserRouter = require("./routers/Userrouter");
const ProjectRouter = require("./routers/Projectrouter");

require("dotenv").config();
dotenv.config();

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

//endpoint or route
app.get("/", (req, res) => {
  res.send("response from express");
});

app.listen(port, () => {
  console.log("express server started ");
});
