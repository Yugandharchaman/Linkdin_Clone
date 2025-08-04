import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.create({ content, author: req.user._id });
    const populatedPost = await post.populate("author", "name");
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name").sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
