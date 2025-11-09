const { Schema, model } = require("../connection");
const mySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    projectName: String,
    description: String,
    prompt: String,
    code: String,
  },
  { timestamps: true }
);

module.exports = model("users", mySchema);
