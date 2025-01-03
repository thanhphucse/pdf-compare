import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NewProjectForm from "../components/NewProjectForm";
import {API_BASE_URL} from "../api";
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null; 
};

// Create an Axios interceptor to include the token in every request
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let creatNewProjectFlag = false;

export const getCreateNewProjectFlag = () => creatNewProjectFlag;
export const setCreateNewProjectFlag = (value) => {
    creatNewProjectFlag = value;
};

const HomePage = ({setSelectedProject}) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);
  const [newProject, setNewProject] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch existing projects for the authenticated user
    axios
      .get(`${API_BASE_URL}/api/projects/`)
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  useEffect(() => {
    if(creatNewProjectFlag){
      setNewProject(true);
      setShowPopup(false);
      creatNewProjectFlag = false;
    }
  }, [creatNewProjectFlag]);

  const handleQuickStart = () => {
    navigate("/images"); // Navigate to the image comparison page
  };

  const handleCreateNewProject = () => {
    setShowPopup(false);
    setNewProject(true);
  };
  const handleExistProject = () => {
    // if(projects.length >= 0){
      navigate("/projects");
    // }
  };

  const handleOpenExistingProject = (projectId) => {
    const selectedProject = projects.find((project) => project.id === parseInt(projectId));
    setSelectedProject(selectedProject); // Pass selected project to parent
  };
  const handleNewProjectCreated = (createdProject) => {
    setSelectedProject(createdProject); // Pass newly created project to parent
    navigate("/images");
  };
  return (
     <>
      {showPopup && (
        <div className="popup-container">
          <div className="popup"> 
            <h2>Welcome!</h2>
            <p>Choose an option to get started</p>
            <button onClick={handleCreateNewProject}>Create New Project</button>
            <div className="open-project-section">
              {/* <button onClick={() => setShowPopup(false)}>Open Existing Project</button> */}
              <button onClick={handleExistProject}>
                Open Existing Project
              </button>
              {projects.length >= 0 && (
                <select 
                  onChange={(e) => handleOpenExistingProject(e.target.value)}
                  className="project-select"
                >
                  <option value="">Select a Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button onClick={handleQuickStart}>Quick Start</button>
          </div>
        </div>
        )}
        {newProject &&(
          <NewProjectForm onProjectCreated={handleNewProjectCreated}/>
        )}
    </>
  );
};

export default HomePage;
