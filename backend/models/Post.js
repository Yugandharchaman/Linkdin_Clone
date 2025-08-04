import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
