import { useSession, getSession } from "next-auth/react";
import { useState } from "react";

export default function AddUserPage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    city: "",
    country: "",
    lat: "",
    lon: "",
    picture: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch("/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("User added successfully!");
      } else {
        setMessage(data.message || "Failed to add user.");
      }
    } catch (error) {
      setMessage("An error occurred while adding the user.");
    }
  };

  if (!session || session.user.role !== "admin") {
    return <p>Access denied: Admins only.</p>;
  }

  return (
    <div>
      <h1>Add New User</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddUser();
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userData.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={userData.age}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={userData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={userData.country}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lat"
          placeholder="Latitude"
          value={userData.lat}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lon"
          placeholder="Longitude"
          value={userData.lon}
          onChange={handleChange}
        />
        <input
          type="url"
          name="picture"
          placeholder="Picture URL"
          value={userData.picture}
          onChange={handleChange}
        />
        <button type="submit">Add User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
