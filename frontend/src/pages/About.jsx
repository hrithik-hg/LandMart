import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaHandshake,
  FaChartLine,
  FaMapMarkerAlt,
  FaArrowRight,
  FaUsers,
  FaAward,
  FaMedal,
  FaQuoteLeft
} from "react-icons/fa";

const About = () => {
  // State for animation and interaction
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [stats, setStats] = useState({ users: 0, properties: 0, cities: 0 });
  const [isVisible, setIsVisible] = useState({});

  // Simulated testimonials data
  const testimonials = [
    {
      name: "Hrithik",
      role: "First-time Homebuyer",
      content:
        "LandMart made finding my first home incredibly easy. The neighborhood insights were invaluable!",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Rahul",
      role: "Property Investor",
      content:
        "The market analytics and comparison tools have helped me make informed investment decisions.",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Rohit",
      role: "Property Seller",
      content:
        "I sold my house in just 2 weeks. The verification system brought me serious buyers only.",
      image: "/api/placeholder/60/60",
    },
  ];

  // Animation for stats counting up
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        return {
          users: prev.users < 5000 ? prev.users + 50 : 5000,
          properties: prev.properties < 12000 ? prev.properties + 120 : 12000,
          cities: prev.cities < 150 ? prev.cities + 2 : 150,
        };
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll(".animate-on-scroll");
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // Helper for fade-in animation classes
  const getAnimationClass = (id) => {
    return isVisible[id]
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-10";
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section with Parallax Effect */}
      <section className="relative py-24 rounded-2xl mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/api/placeholder/1200/500')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        />
        <div className="relative z-10 text-center px-6 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Discover Your <span className="text-yellow-400">Perfect Space</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            LandMart is revolutionizing real estate with transparency,
            efficiency, and a people-first approach to property transactions.
          </p>
          <div className="flex justify-center gap-5 w-full max-w-md">
            <Link
              to="/search"
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2 group flex-1"
            >
              Browse Properties
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-12 mb-12 grid grid-cols-1 md:grid-cols-3 gap-8 animate-on-scroll"
        id="stats-section"
      >
        <div
          className={`bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md text-center transition-all duration-1000 ${getAnimationClass(
            "stats-section"
          )}`}
        >
          <FaUsers className="text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-4xl font-bold text-slate-800">
            {stats.users.toLocaleString()}+
          </p>
          <p className="text-gray-600">Happy Users</p>
        </div>
        <div
          className={`bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md text-center transition-all duration-1000 delay-300 ${getAnimationClass(
            "stats-section"
          )}`}
        >
          <FaHome className="text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-4xl font-bold text-slate-800">
            {stats.properties.toLocaleString()}+
          </p>
          <p className="text-gray-600">Properties Listed</p>
        </div>
        <div
          className={`bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md text-center transition-all duration-1000 delay-500 ${getAnimationClass(
            "stats-section"
          )}`}
        >
          <FaMapMarkerAlt className="text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-4xl font-bold text-slate-800">
            {stats.cities.toLocaleString()}+
          </p>
          <p className="text-gray-600">Cities Covered</p>
        </div>
      </section>

      {/* Our Story */}


      {/* Values Section */}
      <section className="py-16 animate-on-scroll" id="values-section">
        <div
          className={`text-center mb-12 transition-all duration-1000 ${getAnimationClass(
            "values-section"
          )}`}
        >
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium mb-4">
            What We Stand For
          </div>
          <h2 className="text-4xl font-semibold text-slate-800 mb-6">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every decision we make and every feature we build is guided by our
            commitment to these principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className={`bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600 hover:transform hover:-translate-y-2 transition-all duration-300 ${getAnimationClass(
              "values-section"
            )}`}
          >
            <FaAward className="text-4xl text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Transparency</h3>
            <p className="text-gray-600">
              We believe in clear, honest communication. All our listings
              provide comprehensive information with no hidden details.
            </p>
          </div>
          <div
            className={`bg-white p-8 rounded-xl shadow-lg border-t-4 border-purple-600 hover:transform hover:-translate-y-2 transition-all duration-300 delay-200 ${getAnimationClass(
              "values-section"
            )}`}
          >
            <FaMedal className="text-4xl text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
            <p className="text-gray-600">
              We constantly strive to improve our platform, services, and
              customer support to deliver the best possible experience.
            </p>
          </div>
          <div
            className={`bg-white p-8 rounded-xl shadow-lg border-t-4 border-green-600 hover:transform hover:-translate-y-2 transition-all duration-300 delay-400 ${getAnimationClass(
              "values-section"
            )}`}
          >
            <FaHandshake className="text-4xl text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Trust</h3>
            <p className="text-gray-600">
              Building relationships on trust is our priority. We verify all
              listings and provide secure transaction processes.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section
        className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl px-8 animate-on-scroll"
        id="services-section"
      >
        <div
          className={`text-center mb-12 transition-all duration-1000 ${getAnimationClass(
            "services-section"
          )}`}
        >
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium mb-4">
            Our Solutions
          </div>
          <h2 className="text-4xl font-semibold text-slate-800 mb-6">
            What We Offer
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides everything you need for a
            successful property journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            className={`bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 ${getAnimationClass(
              "services-section"
            )}`}
          >
            <div className="bg-blue-100 p-4 rounded-full inline-block mb-6">
              <FaHome className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Diverse Listings</h3>
            <p className="text-gray-600">
              From urban apartments to rural estates, find properties that match
              your exact needs and preferences.
            </p>
          </div>
          <div
            className={`bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 delay-100 ${getAnimationClass(
              "services-section"
            )}`}
          >
            <div className="bg-green-100 p-4 rounded-full inline-block mb-6">
              <FaHandshake className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Trusted Transactions</h3>
            <p className="text-gray-600">
              Our verification system ensures you deal with genuine buyers,
              sellers, and legitimate properties.
            </p>
          </div>
          <div
            className={`bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 delay-200 ${getAnimationClass(
              "services-section"
            )}`}
          >
            <div className="bg-purple-100 p-4 rounded-full inline-block mb-6">
              <FaChartLine className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Market Insights</h3>
            <p className="text-gray-600">
              Get real-time pricing data and neighborhood analytics to make
              informed investment decisions.
            </p>
          </div>
          <div
            className={`bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all duration-300 delay-300 ${getAnimationClass(
              "services-section"
            )}`}
          >
            <div className="bg-yellow-100 p-4 rounded-full inline-block mb-6">
              <FaMapMarkerAlt className="text-2xl text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Location Intelligence
            </h3>
            <p className="text-gray-600">
              Interactive maps and detailed area information help you find the
              perfect location.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-blue-100 text-blue-700 rounded-full font-medium mb-4">
            Success Stories
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-6">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how LandMart has transformed property experiences for people just like you.
          </p>
        </div>

        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          {/* Testimonial Cards */}
          <div className="relative h-96 md:h-64">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`absolute inset-0 p-8 transition-all duration-500 ${
                  activeTestimonial === index 
                    ? 'opacity-100 translate-x-0' 
                    : index < activeTestimonial 
                      ? 'opacity-0 -translate-x-full' 
                      : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center h-full">
                  <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                    <div className="relative">
                      <div className="w-24 h-24 bg-blue-100 rounded-full absolute -inset-2"></div>
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover relative z-10 border-4 border-white shadow-md"
                      />
                    </div>
                  </div>
                  <div className="md:w-3/4 text-center md:text-left">
                    <FaQuoteLeft className="text-blue-100 text-4xl mb-4 hidden md:block" />
                    <p className="text-lg text-gray-700 italic mb-6">{testimonial.content}</p>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xl">{testimonial.name}</h4>
                      <p className="text-blue-600 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 py-4 bg-slate-50 border-t border-slate-100">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                className={`w-4 h-4 rounded-full transition-all ${
                  activeTestimonial === index 
                    ? 'bg-blue-600 scale-100' 
                    : 'bg-blue-200 scale-75 hover:scale-90'
                }`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 mt-8 animate-on-scroll" id="cta-section">
        <div
          className={`relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl text-white text-center px-8 py-16 transition-all duration-1000 ${getAnimationClass(
            "cta-section"
          )}`}
        >
          <div className="absolute inset-0 bg-black opacity-10 pattern-dots"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their dream homes
              through LandMart.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/search"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2 group"
              >
                Browse Listings
                <FaArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/create-listing"
                className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition flex items-center justify-center gap-2"
              >
                List Your Property
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default About;
