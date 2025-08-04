import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import PostForm from "./PostForm";
import { ThumbsUp, MessageCircle, Send } from "lucide-react";

function Feed() {
  const [posts, setPosts] = useState([]);
  const { token } = useContext(AuthContext);
  const [likes, setLikes] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);

  // 🎨 Predefined Tailwind background color classes
  const colorClasses = [
    "bg-red-500", "bg-green-500", "bg-blue-500",
    "bg-yellow-500", "bg-purple-500", "bg-pink-500",
    "bg-orange-500", "bg-teal-500", "bg-indigo-500"
  ];

  // Assign a random color for each post author
  const getRandomColor = (id) => {
    const hash = Array.from(id || "default").reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    return colorClasses[hash % colorClasses.length];
  };

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
    const storedLikedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};

    setLikes(storedLikes);
    setLikedPosts(storedLikedPosts);
    setComments(storedComments);
  }, []);

  useEffect(() => {
    localStorage.setItem("likes", JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
      const updatedLikes = { ...storedLikes };
      res.data.forEach((p) => {
        if (updatedLikes[p._id] === undefined) {
          updatedLikes[p._id] = 0;
        }
      });

      setPosts(res.data);
      setLikes(updatedLikes);
      localStorage.setItem("likes", JSON.stringify(updatedLikes));

      setTimeout(() => setLoading(false), 500);
    } catch {
      alert("Error loading posts");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = (postId) => {
    if (!likedPosts[postId]) {
      setLikes((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1,
      }));
      setLikedPosts((prev) => ({ ...prev, [postId]: true }));
    } else {
      setLikes((prev) => ({
        ...prev,
        [postId]: Math.max((prev[postId] || 0) - 1, 0),
      }));
      setLikedPosts((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (postId) => {
    if (!commentText[postId]?.trim()) return;

    const newComments = {
      ...comments,
      [postId]: [...(comments[postId] || []), commentText[postId].trim()],
    };

    setComments(newComments);
    setCommentText({ ...commentText, [postId]: "" });
    setShowComments((prev) => ({ ...prev, [postId]: false }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-900 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-900 rounded-full animate-bounce delay-150"></div>
          <div className="w-3 h-3 bg-blue-900 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-6 px-4">
      <PostForm onPostCreated={fetchPosts} />

      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white shadow-lg rounded-xl p-4 mb-4 border border-blue-200 hover:shadow-xl transition"
        >
          {/* Post Header */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-lg ${getRandomColor(
                post.author?._id
              )}`}
            >
              {post.author?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{post.author?.name}</h4>
              <small className="text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </small>
            </div>
          </div>

          {/* Post Content */}
          <p className="text-gray-800 mb-4">{post.content}</p>

          {/* Post Actions */}
          <div className="flex justify-around text-gray-600 border-t pt-3 text-sm">
            <button
              className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
              onClick={() => handleLike(post._id)}
            >
              <ThumbsUp
                size={24}
                className={`p-1 rounded-full transition ${
                  likedPosts[post._id]
                    ? "bg-blue-900 text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
              />
              Like ({likes[post._id] || 0})
            </button>

            <button
              className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
              onClick={() => toggleComments(post._id)}
            >
              <MessageCircle size={20} /> Comment
            </button>
          </div>

          {/* Comment Section */}
          {showComments[post._id] && (
            <div className="mt-3 border-t pt-3">
              {comments[post._id]?.map((c, i) => (
                <p key={i} className="text-sm text-gray-700 mb-1">
                  💬 {c}
                </p>
              ))}
              <div className="flex gap-2 mt-2">
                <input
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText({ ...commentText, [post._id]: e.target.value })
                  }
                  placeholder="Write a comment..."
                  className="border rounded-lg p-2 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={() => handleAddComment(post._id)}
                  className="bg-blue-900 text-white px-3 rounded-lg hover:bg-blue-800 flex items-center gap-1"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Feed;
