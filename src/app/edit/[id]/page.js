'use client'
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from './edit.module.css'; // Importing CSS Module

const EditUser = () => {
  const router = useRouter();
  const { id } = useParams(); // Extract the profile ID from the route
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return; // Ensure ID is available
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setFormData({
          name: data.name,
          age: data.age,
          location: data.location,
        });
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/usersss/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Failed to update profile: " + errorText);
        return;
      }

      const updatedUser = await response.json();
      console.log("Profile updated successfully:", updatedUser);
      alert("Profile updated successfully!");
      router.push("/"); // Redirect back to the main page
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("An error occurred while updating the profile: " + error.message);
    }
  };

  return (
    <div className={styles.editContainer}>
      <h1 className={styles.h1}>Edit User</h1>
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <label className={styles.formLabel}>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles.formInput}
          />
        </label>
        <button type="submit" className={styles.submitButton}>Update</button>
      </form>
    </div>
  );
};

export default EditUser;
