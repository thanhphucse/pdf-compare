import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";

const SidePanel = () => {
  return (
    <Box
      sx={{
        width: "100vh",
        borderLeft: "1px solid #ddd",
        padding: 2,
        height: "100vh", // Adjust for top bar height
        overflowY: "auto",
      }}
    >
      {/* Summary Section */}
      <Typography variant="h6" gutterBottom>
        Summary of Differences
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Page 1: 5 differences" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Page 2: 2 differences" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Page 3: 3 differences" />
        </ListItem>
      </List>

      {/* Navigation Controls */}
      <Typography variant="h6" gutterBottom>
        Navigation Controls
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined">Previous</Button>
        <Button variant="outlined">Next</Button>
      </Box>

      {/* Report Generation */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Report
        </Typography>
        <Button variant="contained" color="primary">
          Generate Report
        </Button>
      </Box>
    </Box>
  );
};

export default SidePanel;
