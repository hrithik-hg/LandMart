import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 5000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);
      data.append("cloud_name", cloudName);

      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      );

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } else {
          setImageUploadError(`Upload failed with status: ${xhr.status}`);
          reject(`Upload failed with status: ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        setImageUploadError("An error occurred during the upload.");
        reject("An error occurred during the upload.");
      };

      xhr.send(data);
    });
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed");
          setUploading(false);
        });
    } else if (files.length === 0) {
      setImageUploadError("Select an image to upload");
    } else {
      setImageUploadError("You can upload only 6 images per listing");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    // For sale or rent toggling
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    // For checkboxes
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    // For text, number, and textarea inputs
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate that at least one image is uploaded
    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image");
      setCurrentStep(3); // Go to images step
      return;
    }
    // Validate discount price only if offer is true
    if (formData.offer && +formData.regularPrice < +formData.discountPrice) {
      setError("Discount price must be lower than regular price");
      setCurrentStep(2); // Go to price step
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full mb-6">
        <div className="flex justify-between mb-2">
          {[...Array(totalSteps)].map((_, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center"
              onClick={() => setCurrentStep(i + 1)}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${i + 1 === currentStep 
                  ? 'bg-slate-700 text-white' 
                  : i + 1 < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }
                cursor-pointer
              `}>
                {i + 1 < currentStep ? "✓" : i + 1}
              </div>
              <span className="text-xs mt-1">
                {i === 0 ? "Basic Info" : i === 1 ? "Features & Price" : "Images"}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-slate-700 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      
      {renderProgressBar()}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {currentStep === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-medium mb-4 pb-2 border-b">Basic Information</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 text-sm font-medium">Property Name</label>
                <input
                  type="text"
                  placeholder="e.g. Modern Apartment in City Center"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  id="name"
                  maxLength="62"
                  minLength="10"
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
                <p className="text-xs text-gray-500 mt-1">Enter a descriptive name (10-62 characters)</p>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="description" className="mb-1 text-sm font-medium">Description</label>
                <textarea
                  onChange={handleChange}
                  value={formData.description}
                  placeholder="Describe the property, including its features, location advantages, etc."
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  id="description"
                  rows="5"
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="address" className="mb-1 text-sm font-medium">Address</label>
                <input
                  type="text"
                  placeholder="Full property address"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  id="address"
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
              </div>
              
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Property Type</label>
                <div className="flex gap-8">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rent"
                      name="propertyType"
                      className="w-5 h-5 text-slate-700"
                      onChange={handleChange}
                      checked={formData.type === "rent"}
                    />
                    <label htmlFor="rent" className="ml-2">For Rent</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="sale"
                      name="propertyType"
                      className="w-5 h-5 text-slate-700"
                      onChange={handleChange}
                      checked={formData.type === "sale"}
                    />
                    <label htmlFor="sale" className="ml-2">For Sale</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                type="button" 
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 focus:outline-none"
                onClick={nextStep}
              >
                Next: Features & Price
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-medium mb-4 pb-2 border-b">Features & Pricing</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Property Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="parking"
                    className="w-5 h-5 rounded text-slate-700"
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <label htmlFor="parking" className="ml-2">Parking Spot</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="w-5 h-5 rounded text-slate-700"
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <label htmlFor="furnished" className="ml-2">Furnished</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="offer"
                    className="w-5 h-5 rounded text-slate-700"
                    onChange={handleChange}
                    checked={formData.offer}
                  />
                  <label htmlFor="offer" className="ml-2">Special Offer</label>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Property Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="bedrooms" className="mb-1 text-sm font-medium">Bedrooms</label>
                  <div className="flex">
                    <button 
                      type="button"
                      className="border border-r-0 rounded-l px-3 bg-gray-100 hover:bg-gray-200"
                      onClick={() => setFormData({...formData, bedrooms: Math.max(1, formData.bedrooms - 1)})}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="bedrooms"
                      min="1"
                      max="10"
                      required
                      className="p-3 border text-center w-20"
                      onChange={handleChange}
                      value={formData.bedrooms}
                    />
                    <button 
                      type="button"
                      className="border border-l-0 rounded-r px-3 bg-gray-100 hover:bg-gray-200"
                      onClick={() => setFormData({...formData, bedrooms: Math.min(10, formData.bedrooms + 1)})}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label htmlFor="bathrooms" className="mb-1 text-sm font-medium">Bathrooms</label>
                  <div className="flex">
                    <button 
                      type="button"
                      className="border border-r-0 rounded-l px-3 bg-gray-100 hover:bg-gray-200"
                      onClick={() => setFormData({...formData, bathrooms: Math.max(1, formData.bathrooms - 1)})}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="bathrooms"
                      min="1"
                      max="10"
                      required
                      className="p-3 border text-center w-20"
                      onChange={handleChange}
                      value={formData.bathrooms}
                    />
                    <button 
                      type="button"
                      className="border border-l-0 rounded-r px-3 bg-gray-100 hover:bg-gray-200"
                      onClick={() => setFormData({...formData, bathrooms: Math.min(10, formData.bathrooms + 1)})}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Pricing</h3>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="regularPrice" className="mb-1 text-sm font-medium">Regular Price (₹)</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="regularPrice"
                      min="5000"
                      max="10000000"
                      required
                      className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 w-full"
                      onChange={handleChange}
                      value={formData.regularPrice}
                    />
                    <span className="ml-2 text-gray-500 text-sm">{formData.type === "rent" ? "/ month" : ""}</span>
                  </div>
                </div>
                
                {formData.offer && (
                  <div className="flex flex-col">
                    <label htmlFor="discountPrice" className="mb-1 text-sm font-medium">Discounted Price (₹)</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        id="discountPrice"
                        min="0"
                        max={formData.regularPrice - 1}
                        required
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 w-full"
                        onChange={handleChange}
                        value={formData.discountPrice}
                      />
                      <span className="ml-2 text-gray-500 text-sm">{formData.type === "rent" ? "/ month" : ""}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be lower than regular price</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button 
                type="button" 
                className="px-6 py-2 border border-slate-700 text-slate-700 rounded-lg hover:bg-slate-100 focus:outline-none"
                onClick={prevStep}
              >
                Back
              </button>
              <button 
                type="button" 
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 focus:outline-none"
                onClick={nextStep}
              >
                Next: Upload Images
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-medium mb-4 pb-2 border-b">Upload Images</h2>
            
            <div className="mb-6">
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium">Property Images</label>
                <span className="text-sm text-gray-500">
                  Upload up to 6 images. The first image will be used as the cover.
                </span>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                />
                <label 
                  htmlFor="images" 
                  className="block cursor-pointer mb-3"
                >
                  <div className="flex flex-col items-center justify-center py-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">Click to select images</p>
                    <p className="text-xs text-gray-400">JPG, PNG or JPEG</p>
                  </div>
                </label>
                {files.length > 0 && (
                  <div className="text-sm text-gray-500 mb-3">
                    {files.length} {files.length === 1 ? 'file' : 'files'} selected
                  </div>
                )}
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleImageSubmit}
                  className={`py-2 px-4 rounded ${
                    uploading
                      ? "bg-gray-400 text-white"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {uploading ? "Uploading..." : "Upload Images"}
                </button>
              </div>
              
              {imageUploadError && (
                <div className="mt-2 text-red-600 text-sm">{imageUploadError}</div>
              )}
            </div>
            
            {formData.imageUrls.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Uploaded Images ({formData.imageUrls.length}/6)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.imageUrls.map((url, index) => (
                    <div
                      key={url}
                      className="relative border rounded-lg overflow-hidden group"
                    >
                      <div className="relative pb-[66%]">
                        <img
                          src={url}
                          alt={`listing-image-${index}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleRemoveImage(index)}
                          type="button"
                          className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-slate-700 text-white text-xs px-2 py-1 rounded">
                          Cover Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {error && <div className="text-red-600 mb-4">{error}</div>}
            
            <div className="flex justify-between mt-6">
              <button 
                type="button" 
                className="px-6 py-2 border border-slate-700 text-slate-700 rounded-lg hover:bg-slate-100 focus:outline-none"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className={`px-6 py-2 rounded-lg ${
                  loading || uploading
                    ? "bg-gray-400 text-white"
                    : "bg-slate-700 text-white hover:bg-slate-800"
                }`}
              >
                {loading ? "Creating..." : "Create Listing"}
              </button>
            </div>
          </div>
        )}
      </form>
      
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default CreateListing;