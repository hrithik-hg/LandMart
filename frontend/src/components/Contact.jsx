import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/user/${listing.userRef}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.error("Error fetching landlord:", error);
        setError("Failed to load landlord information");
      } finally {
        setLoading(false);
      }
    };

    if (listing?.userRef) {
      fetchLandLord();
    }
  }, [listing?.userRef]);

  return (
    <>
      {loading && (
        <p className="text-center">Loading landlord information...</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message"
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${
              landlord.email
            }?subject=Regarding ${encodeURIComponent(
              listing.name
            )}&body=${encodeURIComponent(message)}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
