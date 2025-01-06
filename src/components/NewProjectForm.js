import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";
import Swal from "sweetalert2";

const NewProjectForm = ({onProjectCreated} ) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = { name, description };
    const token = localStorage.getItem('token'); // Get the token
    axios
      .post(`${API_BASE_URL}/api/projects/`, projectData, {
            headers: {
            Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "success",
          text: "Project created successfully!",
        });
        // navigate(`/projects/${response.data.id}`); // Redirect to the new project page
        onProjectCreated(response.data); // Pass the new project to the parent
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "error",
          text: "Error creating project",
        });
      });
  };

  return (
    <div className="project-form">
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Project Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default NewProjectForm;
