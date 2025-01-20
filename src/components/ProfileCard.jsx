'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react"; // Import useSession hook from next-auth
import "./App.css";
import { useRouter } from "next/navigation";

const ProfileCard = () => {
  const { data: session } = useSession(); // Get session data
  const [profiles, setProfiles] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const router = useRouter();
  const MAPAPI = process.env.NEXT_PUBLIC_GOOGLEMAP_API;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("Fetched profiles:", data.data); // Debug the API response
        setProfiles(data.data);
      } catch (error) {
        console.error("Error fetching profiles:", error.message);
      }
    };

    fetchProfiles();
  }, []);

  const handleShowOnMap = (profile) => {
    if (profile.latitude && profile.longitude) {
      setSelectedLocation({
        lat: parseFloat(profile.latitude),
        lng: parseFloat(profile.longitude),
      });
    } else {
      console.warn("Profile location is undefined. Defaulting to San Francisco.");
      setSelectedLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
    }
  };
  

  const handleDelete = async (profileId) => {
    try {
      const response = await fetch(`/api/userss/${profileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Failed to delete the profile: " + errorText);
        return;
      }

      alert("Profile deleted successfully!");
      // Remove the deleted profile from the UI
      setProfiles(profiles.filter((profile) => profile._id !== profileId));
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("An error occurred while deleting the profile.");
    }
  };

  const handleEdit = (profileId) => {
    if (!profileId) {
      console.error("Profile ID is undefined!");
      return;
    }
    router.push(`/edit/${profileId}`);
    console.log("Edit profile with ID:", profileId);
  };

  return (
    <div className="container">
      <div className="profile-cards">
        {profiles.length === 0 ? (
          <p>Loading profiles...</p>
        ) : (
          profiles.map((profile, index) => (
            <div key={index} className="profile-card">
              <div className="profile-left">
                <Image
                  src="/default.jpg" // Default image if no profile picture is available
                  alt="Profile"
                  className="img1"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="profile-right">
                <div className="cont">
                  <h1>{profile.name}</h1>
                  <p>{profile.age} years old</p>
                  <p>{profile.location}</p>
                </div>
                <button
                  onClick={() => handleShowOnMap(profile)}
                  className="map-button"
                >
                  Show on map
                </button>

                {/* Show edit and delete buttons if the user is logged in and is an admin */}
                {session && session.user && session.user.isAdmin ? (
                  <div className="admin-actions">
                    <button
                      onClick={() => handleEdit(profile.id || profile._id)} // Adjust based on API response
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id || profile._id)} // Adjust based on API response
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Map Section */}
      <div className="right-map">
        {selectedLocation ? (
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${MAPAPI}&q=${selectedLocation.lat},${selectedLocation.lng}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Map"
          ></iframe>
        ) : (
          <p>Select a profile to see the location on the map.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
