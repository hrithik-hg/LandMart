import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useSelector } from "react-redux";
import {
  FaShare,
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaArrowLeft,
  FaHeart,
} from "react-icons/fa";
import "swiper/css/bundle";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation, Pagination, Autoplay]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("API did not return JSON:", text);
          throw new Error("Server returned non-JSON response");
        }

        if (data.success === false) {
          throw new Error(data.message || "Failed to fetch listing");
        }

        setListing(data);
        setError(false);
      } catch (error) {
        console.error("Fetch error:", error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
    // Logic to save favorite to user profile would go here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-red-600 mb-4">Unable to load listing details</p>
        <button 
          onClick={() => window.history.back()}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      {listing && (
        <>
          <div className="relative">
            <Swiper 
              navigation 
              pagination={{ clickable: true }} 
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              className="listing-swiper"
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[60vh] md:h-[70vh]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="absolute top-4 left-4 z-10">
              <button 
                onClick={() => window.history.back()}
                className="bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 flex justify-center items-center transition"
              >
                <FaArrowLeft className="text-slate-700" />
              </button>
            </div>

            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button 
                onClick={handleFavorite}
                className="bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 flex justify-center items-center transition"
              >
                <FaHeart className={favorite ? "text-red-500" : "text-slate-400"} />
              </button>
              <button 
                onClick={handleShare}
                className="bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 flex justify-center items-center transition"
              >
                <FaShare className="text-slate-700" />
              </button>
            </div>

            {copied && (
              <div className="absolute top-16 right-4 z-10 bg-black/80 text-white text-sm px-3 py-1 rounded-md">
                Link copied to clipboard
              </div>
            )}
          </div>

          <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white -mt-8 md:-mt-16 rounded-t-3xl shadow-md relative z-20">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{listing.name}</h1>
                  
                  <div className="flex items-center bg-slate-100 px-3 py-2 rounded-lg">
                    <span className="text-xl font-bold text-slate-800">₹ {listing.offer
                      ? listing.discountPrice.toLocaleString("en-IN")
                      : listing.regularPrice.toLocaleString("en-IN")}
                    </span>
                    {listing.type === "rent" && <span className="text-sm text-slate-500 ml-1">/month</span>}
                  </div>
                </div>

                <div className="flex items-center mt-2 text-slate-600">
                  <FaMapMarkerAlt className="text-green-700 mr-2" />
                  <p className="text-sm">{listing.address}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    listing.type === "rent" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                  }`}>
                    {listing.type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                  
                  {listing.offer && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      ₹ {((listing.regularPrice || 0) - (listing.discountPrice || 0)).toLocaleString("en-IN")} OFF
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">Description</h2>
                  <p className="text-slate-600 leading-relaxed">{listing.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
                  <div className="bg-slate-200 rounded-full p-3 mb-2">
                    <FaBed className="text-xl text-slate-700" />
                  </div>
                  <p className="text-sm text-slate-500">Bedrooms</p>
                  <p className="font-semibold text-slate-800">{listing.bedrooms}</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
                  <div className="bg-slate-200 rounded-full p-3 mb-2">
                    <FaBath className="text-xl text-slate-700" />
                  </div>
                  <p className="text-sm text-slate-500">Bathrooms</p>
                  <p className="font-semibold text-slate-800">{listing.bathrooms}</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
                  <div className="bg-slate-200 rounded-full p-3 mb-2">
                    <FaParking className="text-xl text-slate-700" />
                  </div>
                  <p className="text-sm text-slate-500">Parking</p>
                  <p className="font-semibold text-slate-800">{listing.parking ? "Available" : "Not Available"}</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
                  <div className="bg-slate-200 rounded-full p-3 mb-2">
                    <FaChair className="text-xl text-slate-700" />
                  </div>
                  <p className="text-sm text-slate-500">Furnishing</p>
                  <p className="font-semibold text-slate-800">{listing.furnished ? "Furnished" : "Unfurnished"}</p>
                </div>
              </div>
            </div>

            {currentUser && listing.userRef !== currentUser._id && (
              <div className="mt-8 border-t pt-6">
                {!contact ? (
                  <button
                    onClick={() => setContact(true)}
                    className="w-full md:w-auto bg-slate-800 text-white font-medium px-6 py-3 rounded-lg hover:bg-slate-700 transition flex items-center justify-center"
                  >
                    Contact Landlord
                  </button>
                ) : (
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>
                    <Contact listing={listing} />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;