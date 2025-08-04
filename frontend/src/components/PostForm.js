import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function PostForm({ onPostCreated }) {
  const [content, setContent] = useState("");
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/posts",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Save post to localStorage for Profile page
      const savedPosts = JSON.parse(localStorage.getItem("userPosts")) || [];
      savedPosts.unshift(content); // Add newest at top
      localStorage.setItem("userPosts", JSON.stringify(savedPosts));

      setContent("");
      onPostCreated();
      toast.success("Post created successfully! 🎉");
    } catch {
      toast.error("Error creating post");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-20 bg-white p-4 rounded-2xl shadow-lg border-t-4 border-blue-900 mb-6 max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-bold text-blue-900 mb-4">Create a Post</h2>

      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        rows="3"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition-all font-semibold shadow-md"
        >
          Post
        </button>
      </div>
    </form>
  );
}

export default PostForm;
