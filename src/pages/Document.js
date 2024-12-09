import React, { useState } from "react";
import { Box, Typography, Button, Grid2 } from "@mui/material";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const Document = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [highlightedPDF1, setHighlightedPDF1] = useState(null); // URL for highlighted PDF 1
  const [highlightedPDF2, setHighlightedPDF2] = useState(null); // URL for highlighted PDF 2
  const [file1Preview, setFile1Preview] = useState(null);
  const [file2Preview, setFile2Preview] = useState(null);

  const handleFileChange = (e, fileNumber) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // Generate a preview URL for rendering

      if (fileNumber === 1) {
        setFile1(file);
        setFile1Preview(fileURL); // Set the preview URL for file1
      } else {
        setFile2(file);
        setFile2Preview(fileURL); // Set the preview URL for file2
      }
    }
  };

  const handleCompare = async () => {
    if (!file1 || !file2) {
      alert("Please upload both PDF files before submitting.");
      return;
    }

    // Create form data to send to backend
    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    try {
      // Send files to the backend for comparison
      const response = await fetch("http://127.0.0.1:8000/api/compare-pdfs/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to compare PDFs");
      }

      const result = await response.json();
      if (result.highlighted_pdf1_url && result.highlighted_pdf2_url) {
        setHighlightedPDF1(`http://127.0.0.1:8000${result.highlighted_pdf1_url}`);
        setHighlightedPDF2(`http://127.0.0.1:8000${result.highlighted_pdf2_url}`);
      } else {
        alert("No differences found or result is missing.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while comparing PDFs.");
    }
  };

  return (
    <>
      <Grid2 size={12} container justifyContent={"center"}>
        <Typography variant="h5" gutterBottom>
          Compare Two PDF Documents
        </Typography>        
      </Grid2>

      <Grid2 size={12} container justifyContent={"center"}>
            <Grid2 size={6} container justifyContent={"center"}>
                <Typography variant="subtitle1">Upload First PDF:</Typography>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 1)}
                />
            </Grid2>
            <Grid2 size={6} container justifyContent={"center"}>
                <Typography variant="subtitle1">Upload Second PDF:</Typography>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 2)}
                />
            </Grid2>
      </Grid2>

      <Grid2 container spacing={2} size={12}>
        {/* PDF 1 Upload and Preview */}
        <Grid2
          item
          xs={12}
          sm={6}
          sx={{
            border: 1,
            borderStyle: "dashed",
            borderColor: "success.main",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            padding: 2,
          }}
          size={6}
        >
          
          {highlightedPDF1 ? ( // Check if highlightedPDF1 is available
            <Box sx={{ mt: 2, width: "100%", height: "100vh" }}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={highlightedPDF1} />
              </Worker>
            </Box>
          ) : (
            file1Preview && ( // Otherwise, show file1Preview
              <Box sx={{ mt: 2, width: "100%", height: "80vh" }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl={file1Preview} />
                </Worker>
              </Box>
            )
          )}
        </Grid2>

        {/* PDF 2 Upload and Preview */}
        <Grid2
          item
          xs={12}
          sm={6}
          sx={{
            border: 1,
            borderStyle: "dashed",
            borderColor: "success.main",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            padding: 2,
          }}
          size={6}
        >
          
          {highlightedPDF2 ? ( // Check if highlightedPDF2 is available
            <Box sx={{ mt: 2, width: "100%", height: "100vh" }}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={highlightedPDF2} />
              </Worker>
            </Box>
          ) : (
            file2Preview && ( // Otherwise, show file2Preview
              <Box sx={{ mt: 2, width: "100%", height: "80vh" }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl={file2Preview} />
                </Worker>
              </Box>
            )
          )}
        </Grid2>
      </Grid2>

      {/* Compare Button */}
      <Grid2 container justifyContent={"center"} size={12}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleCompare}
        >
          Compare
        </Button>
      </Grid2>
    </>
  );
};

export default Document;
