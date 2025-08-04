import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { MoreVertical } from "lucide-react";

function Profile() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    surname: "",
    email: user?.email || "",
    phone: "",
    description: "",
    coverImage: "",
    profileImage: ""
  });

  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true); // 🔹 Loading state

  // Load profile & posts from localStorage
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
      if (savedProfile) setProfile(savedProfile);

      const savedPosts = JSON.parse(localStorage.getItem("userPosts")) || [];
      setPosts(savedPosts);

      setLoading(false);
    }, 1000); // Simulate loading delay for effect
  }, []);

  // Save profile to localStorage
  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setEditMode(false);
  };

  // Handle profile field changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle image uploads
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({
          ...prev,
          [type]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete post and update feed
  const deletePost = (postId) => {
    const updatedUserPosts = posts.filter((p) => p._id !== postId);
    setPosts(updatedUserPosts);
    localStorage.setItem("userPosts", JSON.stringify(updatedUserPosts));

    const feedPosts = JSON.parse(localStorage.getItem("feedPosts")) || [];
    const updatedFeedPosts = feedPosts.filter((p) => p._id !== postId);
    localStorage.setItem("feedPosts", JSON.stringify(updatedFeedPosts));

    window.dispatchEvent(new Event("storage"));
  };

  // 🔹 Loading spinner UI
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
    <div className="max-w-3xl mx-auto mt-20 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-300 flex items-center justify-center">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-gray-500">No Cover Image</p>
        )}
        {editMode && (
          <label className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded shadow cursor-pointer text-sm">
            Upload Cover
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "coverImage")}
            />
          </label>
        )}
      </div>

      {/* Profile Image */}
      <div className="relative -mt-16 ml-6 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-400 flex items-center justify-center">
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-3xl font-bold">
            {profile.name?.charAt(0) || "U"}
          </span>
        )}
        {editMode && (
          <label className="absolute bottom-1 right-1 bg-white px-2 py-1 rounded shadow cursor-pointer text-xs">
            Upload
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "profileImage")}
            />
          </label>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            {editMode ? (
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            ) : (
              <p>{profile.name}</p>
            )}
          </div>

          {/* Surname */}
          <div>
            <label className="block text-sm font-semibold mb-1">Surname</label>
            {editMode ? (
              <input
                name="surname"
                value={profile.surname}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            ) : (
              <p>{profile.surname}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            {editMode ? (
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-1">Phone</label>
            {editMode ? (
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            ) : (
              <p>{profile.phone}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Description</label>
          {editMode ? (
            <textarea
              name="description"
              value={profile.description}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          ) : (
            <p>{profile.description}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          {editMode ? (
            <button
              onClick={saveProfile}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* My Posts */}
      <div className="p-6 border-t">
        <h3 className="text-lg font-semibold mb-3">My Posts</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-xl p-4 mb-4 border border-blue-200 hover:shadow-xl transition relative"
            >
              {/* Delete Menu */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => deletePost(post._id)}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <MoreVertical size={18} />
                  Delete
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-900 text-white font-bold text-lg">
                  {profile.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{profile.name}</h4>
                  <small className="text-gray-500">{new Date().toLocaleString()}</small>
                </div>
              </div>

              <p className="text-gray-800">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
