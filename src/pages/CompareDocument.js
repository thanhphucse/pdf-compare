import React, { useState, useRef } from "react";
import { Box, Typography, Button, Grid2 } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { API_BASE_URL, comparePdf } from "../api"; // Import the API function


const CompareDocument = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [highlightedPDF1, setHighlightedPDF1] = useState(null); // URL for highlighted PDF 1
  const [highlightedPDF2, setHighlightedPDF2] = useState(null); // URL for highlighted PDF 2
  const [file1Preview, setFile1Preview] = useState(null);
  const [file2Preview, setFile2Preview] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const hiddenFileInput1 = useRef(null);
  const hiddenFileInput2 = useRef(null);
  const handleClick1 = (event) => {
    hiddenFileInput1.current.click();
  };
  const handleClick2 = (event) => {
    hiddenFileInput2.current.click();
  };

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
    try {
      const result = await comparePdf(file1, file2); // Call the API function

      if (result.highlighted_pdf_url) {
        const uniqueURL = `${API_BASE_URL}${result.highlighted_pdf_url}?t=${new Date().getTime()}`;
        setCompareResult(uniqueURL);
        alert("Comparison successful.");
      } else {
        alert("No differences found or result is missing.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while comparing PDFs.");
    }
  };

  const renderPDFViewer = (fileUrl) => (
      <Viewer fileUrl={fileUrl}/>
  );

  return (
    <>
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
            height: "70vh",
            padding: 2,
          }}
          size={6}
        >
          {file1Preview && (
            <Box sx={{ mt: 2, width: "100%", height: "100%" }}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                {renderPDFViewer(highlightedPDF1 || file1Preview)}
              </Worker>
            </Box>
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
            height: "70vh",
            padding: 2,
          }}
          size={6}
        >
          {file2Preview && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              {renderPDFViewer(highlightedPDF2 || file2Preview)}
            </Worker>
          )}
        </Grid2>
      </Grid2>
      <Grid2 container justifyContent={"center"} size={12}>
        <Grid2 container justifyContent={"center"} size={6}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Button
              variant="outlined"
              component="label"
              onClick={handleClick1}
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 1 }}
              size="small"
            >
              Upload first PDF  
            </Button>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, 1)}
              ref={hiddenFileInput1}
              style={{ display: 'none' }} // Hide the actual input
            />
          </Box>
        </Grid2>
        <Grid2 container justifyContent={"center"} size={6}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Button
              variant="outlined"
              component="label"
              onClick={handleClick2}
              startIcon={<CloudUploadIcon />}
              size="small" 
              sx={{ mt: 1 }}
            >
              Upload second PDF
            </Button>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, 2)}
              ref={hiddenFileInput2}
              style={{ display: 'none' }} // Hide the actual input
            />
          </Box>
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
      {compareResult && (
        <Grid2 container justifyContent={"center"} size={12} sx={{ mt: 3 }}>
          <Grid2 container justifyContent={"center"} size={12}>
            <h2>Compare Result:</h2>
          </Grid2>
          <Grid2 container justifyContent={"center"} size={12}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              {renderPDFViewer(compareResult)}
            </Worker>
          </Grid2>
        </Grid2>
      )}
    </>
  );
};

export default CompareDocument;
