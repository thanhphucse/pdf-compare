import React from "react";
import { Box, Grid2 } from "@mui/material";
import TopBar from "./components/TopBar";
import MainArea from "./components/MainArea";
import SidePanel from "./components/SidePanel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Text from "./pages/Text";
import Document from "./pages/Document";
import Image from "./pages/Image";

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Always display the TopBar */}
        <TopBar />

        <Box sx={{ display: "flex"}}>
          {/* Dynamically render the MainArea and SidePanel based on the route */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Grid2 container spacing={2}>
                    <Grid2 container xs={12} sm={6} size={12} sx={{ p:4 }}>
                      <MainArea pageContent={<Document />}/>
                    </Grid2>
                    {/* <Grid2 container xs={12} sm={6} size={2} sx={{ height: "100vh" }}>
                      <SidePanel />
                    </Grid2> */}
                  </Grid2>
                </>
              }
            />
            <Route
              path="/text"
              element={
                <>
                  <Grid2 container spacing={2}>
                    <Grid2 container xs={12} sm={6} size={12} sx={{ p:4 }}>
                      <MainArea pageContent={<Text />}/>
                    </Grid2>
                    {/* <Grid2 container xs={12} sm={6} size={2} sx={{ height: "100vh" }}>
                      <SidePanel />
                    </Grid2> */}
                  </Grid2>
                </>
              }
            />
            <Route
              path="/document"
              element={
                <>
                  <Grid2 container spacing={2}>
                    <Grid2 container xs={12} sm={6} size={12} sx={{ p:4 }}>
                      <MainArea pageContent={<Document />}/>
                    </Grid2>
                    {/* <Grid2 container xs={12} sm={6} size={2} sx={{ height: "100vh" }}>
                      <SidePanel />
                    </Grid2> */}
                  </Grid2>
                </>
              }
            />
            <Route
              path="/images"
              element={
                <>
                  <Grid2 container spacing={2}>
                    <Grid2 container xs={12} sm={6} size={12} sx={{ p:4 }}>
                      <MainArea pageContent={<Image />}/>
                    </Grid2>
                    {/* <Grid2 container xs={12} sm={6} size={2} sx={{ height: "100vh" }}>
                      <SidePanel />
                    </Grid2> */}
                  </Grid2>
                </>
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;