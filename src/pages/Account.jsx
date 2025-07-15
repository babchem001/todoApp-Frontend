import { useContext, useEffect, useState } from "react";
import { storeContext } from "../assets/context/storeContext";
import Loader from "../assets/layout/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Account() {
  const { token, apiUrl, isLoading, setIsLoading } = useContext(storeContext);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setProfile(data.profile);
        setName(data.profile.name || "");
        setBio(data.profile.bio || "");
        setAvatarUrl(data.profile.avatar || "");
      } else {
        toast.error(data.error || "Failed to fetch profile");
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`${apiUrl}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio, name }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchProfile();
        setEditMode(false);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return toast.warn("Please select a file");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch(`${apiUrl}/profile/updateavatar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Avatar updated successfully!");

        const newAvatar = data.avatar || data.updated?.avatar;
        const fullUrl = newAvatar.startsWith("http")
          ? newAvatar
          : `${apiUrl}/${newAvatar}`;

        setAvatarUrl(fullUrl);
        fetchProfile();
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    }
  };

  if (isLoading) return <Loader />;
  if (!profile || !profile.name) return <div>Profile not found.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 mb-24 bg-white text-[#2d2d2d] rounded-xl shadow-md">
      <div className="w-full max-w-md bg-white shadow rounded p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-500 mt-10">
          My Profile
        </h1>

        {/* Avatar Section */}
        <div className="text-center mb-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
            />
          )}
          {/* <p className="text-xs text-gray-400 break-all">{avatarUrl}</p> */}

          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button
            onClick={handleUploadAvatar}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-10"
          >
            Upload Photo
          </button>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold mb-2">User Information</h2>
        <p className="italic text-xl">
          <strong>Name:</strong> {profile.name}
        </p>
        <p className="italic text-xl">
          <strong>Email:</strong> {profile.user.email}
        </p>

        {/* Bio */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Bio</h2>
        {editMode ? (
          <>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              className="w-full border rounded p-2 mb-3"
              placeholder="Write something about yourself…"
            />
            <div className="space-x-2">
              <button
                onClick={updateHandler}
                className="bg-blue-600 text-white px-4 py-1 rounded"
                disabled={isLoading}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setBio(profile.bio || "");
                  setName(profile.name || "");
                }}
                className="bg-gray-400 px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="italic text-gray-600">
              {profile.bio || "No bio yet"}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-2 bg-purple-600 text-white px-4 py-2 rounded w-35 hover:bg-purple-700 cursor-pointer font-medium"
            >
              Edit Bio
            </button>
          </>
        )}
      </div>

      <div className="w-full flex justify-center mt-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Account;
