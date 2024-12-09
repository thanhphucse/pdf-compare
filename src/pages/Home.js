import React from "react";
import { Box, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ display: "flex", gap: 2, padding: 2 }}>
      {/* PDF 1 Viewer */}
      <Box
        sx={{
          flex: 1,
          border: "1px dashed #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "500px",
        }}
      >
        <Typography variant="body1" color="textSecondary">
          PDF Viewer 1
        </Typography>
      </Box>

      {/* PDF 2 Viewer */}
      <Box
        sx={{
          flex: 1,
          border: "1px dashed #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "500px",
        }}
      >
        <Typography variant="body1" color="textSecondary">
          PDF Viewer 2
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
