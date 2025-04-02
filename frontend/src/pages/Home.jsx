import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from 'swiper';
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import 'swiper/css/bundle';
import 'swiper/css/pagination';
import ListingItem from "../components/ListingItem";
import { FaSearch, FaHeart, FaStar, FaMapMarkerAlt } from "react-icons/fa";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedListings, setDisplayedListings] = useState([]);
  
  SwiperCore.use([Navigation, Autoplay, Pagination]);

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        setLoading(true);
        const [offers, rents, sales] = await Promise.all([
          fetch("/api/listing/get?offer=true&limit=4").then(res => res.json()),
          fetch("/api/listing/get?type=rent&limit=4").then(res => res.json()),
          fetch("/api/listing/get?type=sale&limit=4").then(res => res.json())
        ]);
        
        setOfferListings(offers);
        setRentListings(rents);
        setSaleListings(sales);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllListings();
  }, []);

  // Update displayed listings when filter changes or when listings are loaded
  useEffect(() => {
    if (loading) return;
    
    let filteredListings = [];
    switch (activeFilter) {
      case "rent":
        filteredListings = [...rentListings];
        break;
      case "sale":
        filteredListings = [...saleListings];
        break;
      default: // "all"
        filteredListings = [...offerListings, ...rentListings, ...saleListings];
        break;
    }
    
    // Sort by creation date (newest first)
    filteredListings = filteredListings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
      
    setDisplayedListings(filteredListings);
  }, [activeFilter, offerListings, rentListings, saleListings, loading]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?searchTerm=${searchTerm}`;
    }
  };



  return (
    <div className="bg-gray-50">
      {/* Hero Section with Search */}
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div 
          className="h-[70vh] bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')" }}
        ></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your <span className="text-blue-400">Dream</span> Property
            </h1>
            <p className="text-xl text-white mb-8">
              Discover the perfect home from thousands of listings across India
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search by location, property type, or keyword..."
                className="w-full py-4 px-6 rounded-full shadow-lg focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
              >
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Search Filters */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto py-4 px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/search?type=rent" className="flex items-center px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <span className="text-blue-600 font-medium">Rentals</span>
            </Link>
            <Link to="/search?type=sale" className="flex items-center px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <span className="text-blue-600 font-medium">Buy Property</span>
            </Link>
            <Link to="/search?offer=true" className="flex items-center px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <span className="text-blue-600 font-medium">Special Offers</span>
            </Link>
            <Link to="/create-listing" className="flex items-center px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <span className="text-blue-600 font-medium">List Property</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Listings Carousel */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Properties</h2>
            <Link to="/search" className="text-blue-600 hover:underline font-medium">View All</Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse h-80">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="pb-12"
            >
              {offerListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition h-full flex flex-col">
                    <div className="relative h-48">
                      <img 
                        src={listing.imageUrls[0]} 
                        alt={listing.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 cursor-pointer hover:bg-white transition">
                        <FaHeart className="text-red-500" />
                      </div>
                      {listing.offer && (
                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Special Offer
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{listing.name}</h3>
                        <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span>4.8</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FaMapMarkerAlt className="mr-2" />
                        <span className="line-clamp-1">{listing.address}</span>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-blue-600">
                          ₹{listing.discountPrice?.toLocaleString('en-IN') ?? listing.regularPrice?.toLocaleString('en-IN')}
                          {listing.type === 'rent' && '/month'}
                        </span>
                        <Link 
                          to={`/listing/${listing._id}`} 
                          className="text-blue-600 hover:underline font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {/* Property Categories */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Browse by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Rent */}
          <div className="relative rounded-xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="For Rent" 
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Properties for Rent</h3>
                <Link 
                  to="/search?type=rent" 
                  className="inline-block bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-600 hover:text-white transition"
                >
                  Browse Rentals
                </Link>
              </div>
            </div>
          </div>
          
          {/* For Sale */}
          <div className="relative rounded-xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="For Sale" 
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Properties for Sale</h3>
                <Link 
                  to="/search?type=sale" 
                  className="inline-block bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-600 hover:text-white transition"
                >
                  Browse Properties
                </Link>
              </div>
            </div>
          </div>
          
          {/* Special Offers */}
          <div className="relative rounded-xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Special Offers" 
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Special Offers</h3>
                <Link 
                  to="/search?offer=true" 
                  className="inline-block bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-600 hover:text-white transition"
                >
                  View Offers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Recent Listings</h2>
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-full transition ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
                onClick={() => handleFilterChange('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded-full transition ${activeFilter === 'rent' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
                onClick={() => handleFilterChange('rent')}
              >
                Rent
              </button>
              <button 
                className={`px-4 py-2 rounded-full transition ${activeFilter === 'sale' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
                onClick={() => handleFilterChange('sale')}
              >
                Sale
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {displayedListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No listings found for this filter.</p>
                </div>
              )}
            </>
          )}
          
          <div className="text-center mt-8">
            <Link 
              to={`/search${activeFilter !== 'all' ? `?type=${activeFilter}` : ''}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              View More Listings
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Why Choose Us</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-blue-600 text-4xl font-bold mb-2">10k+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            
            <div className="p-6">
              <div className="text-blue-600 text-4xl font-bold mb-2">8.5k+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            
            <div className="p-6">
              <div className="text-blue-600 text-4xl font-bold mb-2">99%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            
            <div className="p-6">
              <div className="text-blue-600 text-4xl font-bold mb-2">150+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who found their perfect home with us</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/search" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              Browse Properties
            </Link>
            <Link 
              to="/create-listing" 
              className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;