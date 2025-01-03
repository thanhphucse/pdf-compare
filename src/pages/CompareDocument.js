import React, { useState, useRef } from "react";
import { Box, Button, Grid2 } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { API_BASE_URL, comparePdf } from "../api"; // Import the API function
import Swal from "sweetalert2";
import axios from 'axios';

async function handleSaveFilesAndComparison(comparisonData) {
    const { projectId, file1Data, file2Data, comparisonType, resultData, highlightedDifferencesData } = comparisonData;

    // Create FormData to handle binary data
    const formData = new FormData();
    formData.append('project', projectId);  
    formData.append('file1_name', file1Data.name);
    formData.append('file1_type', file1Data.type);
    // formData.append('file1_data', file1Data.data);
    formData.append('file2_name', file2Data.name);
    formData.append('file2_type', file2Data.type);
    // formData.append('file2_data', file2Data.data);
    formData.append('file1_data', new Blob([file1Data.data], { type: file1Data.type }), file1Data.name);
    formData.append('file2_data', new Blob([file2Data.data], { type: file2Data.type }), file2Data.name);
    formData.append('comparison_type', comparisonType);

    if (resultData) {
        formData.append('result_data', resultData);
    }
    if (highlightedDifferencesData) {
        formData.append('highlighted_differences_data', new Blob([highlightedDifferencesData]));
    }

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${API_BASE_URL}/api/comparisons/create_files_and_comparison/`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.status === 201) {
            console.log("Files and comparison saved successfully:", response.data);
            return response.status;
        }
    } catch (error) {
        console.error("Error saving files and comparison:", error);
        throw error;
    }
}

const CompareDocument = ({selectedProject}) => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
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
      Swal.fire({
        icon: "warning",
        title: "Missing Files",
        text: "Please upload both files before comparing.",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      const result = await comparePdf(file1, file2); // Call the API function

      if (result.highlighted_pdf_url) {
        const uniqueURL = `${API_BASE_URL}${result.highlighted_pdf_url}?t=${new Date().getTime()}`;
        setCompareResult(uniqueURL);
        Swal.fire({
          icon: "success",
          title: "Comparison Successful",
          text: "The comparison result is ready.",
        });
      } else {
        if (result.error) { 
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.error.toString(),
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.toString(),
      });
    }
  };

  const renderPDFViewer = (fileUrl) => (
      <Viewer fileUrl={fileUrl}/>
  );
  const handleSave = async () => {
    try {
        // Assume file1 and file2 are File objects from input or drag-and-drop
        const file1Binary = await file1.arrayBuffer();
        const file2Binary = await file2.arrayBuffer();
        // Fetch the comparison result image data from the URL
        let highlightedDifferencesData = null;
        if (compareResult) {
            const response = await fetch(compareResult);
            const blob = await response.blob();
            highlightedDifferencesData = await blob.arrayBuffer();
        }
        // from your comparison process
        const result = await handleSaveFilesAndComparison({
            projectId: selectedProject.id,
            file1Data: {
                name: file1.name,
                type: getFileType(file1.type), // Helper function to map MIME type to your type
                data: file1Binary,
            },
            file2Data: {
                name: file2.name,
                type: getFileType(file2.type),
                data: file2Binary,
            },
            comparisonType: 'pdf',
            resultData: '',
            highlightedDifferencesData: highlightedDifferencesData, // Your highlighted differences binary data
        });
        if (result===201) {
            Swal.fire({
            icon: "success",
            title: "saved",
            text: "The comparison result is saved.",
          });
        }
    } catch (error) {
        Swal.fire({
        icon: "warning",
        title: "Error",
        // text: error.toString(),
        text:"ensure a project is selected.",
      });
    }
  };
  function getFileType(mimeType) {
      if (mimeType.startsWith('image/')) return 'image';
      if (mimeType.startsWith('text/')) return 'text';
      if (mimeType === 'application/pdf') return 'pdf';
      return 'text'; // default fallback
  }

  return (
    <>
      <Grid2 container spacing={2} size={12} sx={{ mt: 14 }}>
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
                {renderPDFViewer(file1Preview)}
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
              {renderPDFViewer(file2Preview)}
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
            <Box sx={{ display: "wrap-content", justifyContent: "center", mb: 2}}>
              <h3 style={{marginRight: '10px'}}>Comparison Result:</h3>
              <Button onClick={handleSave} variant="outlined" color="success" size="small">Save Comparison</Button>
            </Box>
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
