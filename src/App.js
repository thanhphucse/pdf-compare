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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectType, setProjectType] = useState(null);
  console.log(projectType);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!!token){
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
        <TopBar isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />
        <CustomSeparator workingProject={selectedProject} workingTypeProject={setProjectType}/>
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
                    <MainArea pageContent={<CompareText />}/>
                  </Grid2>
                ):
                (<Navigate to="/sign-in"/>)
              }
            />
            <Route
              path="/document"
              element={
                (isAuthenticated) ? (
                    <Grid2 container lg={12} xs={12} sm={12} size={12} sx={{ p:1, mt: 1}}>
                      <MainArea pageContent={<CompareDocument />}/>
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
            {/* Authentication Routes */}
            <Route path="/sign-in" element={<SignIn onSignIn={handleSignIn} setUser={setUser}/>} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/account" element={<Account/>}/>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/" element={<HomePage />}/>
          </Routes>
        </Grid2>
      </Box>
    </Router>
  );
}

export default App;