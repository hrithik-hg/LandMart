import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [profileImage, setProfileImage] = useState(currentUser.avatar);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUD_NAME;

  const dispatch = useDispatch();

  function handleFileUpload(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    data.append("cloud_name", cloudName);

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setProfileImage(response.url);
        setFormData({ ...formData, avatar: response.url });
        setUploadError(null);
      } else {
        setUploadError("Upload failed with status: " + xhr.status);
      }
      setProgress(0);
    };

    xhr.onerror = () => {
      setUploadError("An error occurred during the upload.");
      setProgress(0);
    };

    xhr.send(data);
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  async function handleDeleteUser() {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  async function handleSignoutUser() {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  async function handleShowListings() {
    setShowListingsError(false);
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      if (data.length === 0) {
        setUserListings([]);
        setEmptyData(true);
        return;
      }
      setUserListings(data);
      setShowListingsError(false);
    } catch (error) {
      setShowListingsError(true);
    }
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          src={profileImage}
          alt="Profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 transition-transform duration-300 hover:scale-105"
        />
        <p className="text-sm self-center">
          {uploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : progress > 0 && progress < 100 ? (
            <span className="text-slate-700">{`Uploading ${progress}%`}</span>
          ) : progress === 100 ? (
            <span className="text-green-700">Image Successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          onChange={handleChange}
          defaultValue={currentUser.username}
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          onChange={handleChange}
          defaultValue={currentUser.email}
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-95"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-2">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span
          onClick={handleSignoutUser}
          className="text-red-700 cursor-pointer"
        >
          Sign out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : " "}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User updated successfully!" : " "}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full ">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="gap-4 border rounded-lg p-3 flex justify-between items-center"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing-cover-image"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
