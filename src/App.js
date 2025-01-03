import React, { useState, useEffect} from "react";
import { Box, Grid2, CircularProgress } from "@mui/material";
import TopBar from "./components/TopBar";
import CustomSeparator from "./components/Breadcrumps";
import MainArea from "./components/MainArea";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CompareText from "./pages/CompareText";
import CompareDocument from "./pages/CompareDocument";
import CompareImage from "./pages/CompareImage";
import SignIn from "./auth/Sign-in";
import SignUp from "./auth/Sign-up";
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import ProjectViews from "./components/ProjectViews";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectType, setProjectType] = useState(null);
  console.log(projectType);
  
  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    const accessTokenExpiry = localStorage.getItem("token_expiry");
    if (accessToken && new Date().getTime() < accessTokenExpiry) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress /> {/* Material-UI spinner */}
      </Box>
    );
  }
  const handleSignIn = (token) => {
    localStorage.setItem("token", token); 
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token"); 
    setIsAuthenticated(false);
  };
  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <TopBar isAuthenticated={isAuthenticated} onSignOut={handleSignOut} setSelectedProject={setSelectedProject}/>
        {isAuthenticated && <CustomSeparator workingProject={selectedProject} workingTypeProject={setProjectType}/>}
        <Grid2 sx={{ display: "flex"}} container>
          <Routes>
            <Route
              path="/"
              element={
                (isAuthenticated) ? (
                    <Grid2 container xs={12} sm={12} size={12} sx={{ p:1, mt: 1}}>
                      <MainArea pageContent={<HomePage setSelectedProject={setSelectedProject}/>}/>
                    </Grid2>
                )
                : (
                  <Navigate to="/sign-in"/>
                )
              }
            />
            <Route
              path="/text"
              element={
                (isAuthenticated) ? (
                  <Grid2 container xs={12} sm={6} size={12} sx={{ p:1, mt: 1}}>
                    <MainArea pageContent={<CompareText selectedProject={selectedProject}/>}/>
                  </Grid2>
                ):
                (<Navigate to="/sign-in"/>)
              }
            />
            <Route
              path="/pdf"
              element={
                (isAuthenticated) ? (
                    <Grid2 container lg={12} xs={12} sm={12} size={12} sx={{ p:1, mt: 1}}>
                      <MainArea pageContent={<CompareDocument selectedProject={selectedProject}/>}/>
                    </Grid2>
                ):
                (<Navigate to="/sign-in"/>)
              }
            />
            <Route
              path="/images"
              element={
                (isAuthenticated) ? (
                    <Grid2 container xs={12} sm={6} size={12} sx={{ p:1, mt: 1}}>
                      <MainArea pageContent={<CompareImage selectedProject={selectedProject}/>}/>
                    </Grid2>
                ):
                (<Navigate to="/sign-in"/>)
              }
            />
            <Route
              path="/projects"
              element={
                (isAuthenticated) ? (
                    <Grid2 container xs={12} sm={6} size={12} sx={{ p:1, mt: 1}}>
                      <MainArea pageContent={<ProjectViews onProjectView={setSelectedProject}/>}/>
                    </Grid2>
                ):
                (<Navigate to="/sign-in"/>)
              }
            />
            <Route
              path="/dashboard"
              element={
                (isAuthenticated) ? (
                    <Grid2 container xs={12} sm={6} size={12} sx={{ p:1, mt: 1}}>
                      <MainArea pageContent={<Dashboard onResetProject={setSelectedProject}/>}/>
                    </Grid2>
                ):
                (<Navigate to="/sign-in"/>)
              }
            />
            <Route
              path="/account"
              element={
                (isAuthenticated) ? (
                    <Grid2 container xs={12} sm={6} size={12} sx={{ p:1, mt: 1}}>
                      <MainArea pageContent={<Account onResetProject={setSelectedProject}/>}/>
                    </Grid2>
                ):
                (<Navigate to="/sign-in"/>)
              }
            />
            {/* Authentication Routes */}
            <Route path="/sign-in" element={<SignIn onSignIn={handleSignIn} setUser={setUser}/>} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/account" element={<Account onResetProject={setSelectedProject}/>}/>
            <Route path="/dashboard" element={<Dashboard onResetProject={setSelectedProject}/>}/>
            <Route path="/" element={<HomePage />}/>
            <Route path="/projects" element={<ProjectViews onProjectView={setSelectedProject}/>}/>
          </Routes>
        </Grid2>
      </Box>
    </Router>
  );
}

export default App;