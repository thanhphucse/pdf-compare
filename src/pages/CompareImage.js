import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Grid2 } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { compareImage, API_BASE_URL } from "../api"; // Import the API function
import axios from 'axios';

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Script load error: ${src}`));
    document.head.appendChild(script);
  });
};

async function handleSaveFilesAndComparison(comparisonData) {
    const { projectId, file1Data, file2Data, comparisonType, resultData, highlightedDifferencesData } = comparisonData;

    // Create FormData to handle binary data
    const formData = new FormData();
    formData.append('project', projectId);  
    formData.append('file1_name', file1Data.name);
    formData.append('file1_type', file1Data.type);
    formData.append('file1_data', file1Data.data);
    formData.append('file2_name', file2Data.name);
    formData.append('file2_type', file2Data.type);
    formData.append('file2_data', file2Data.data);
    formData.append('comparison_type', comparisonType);

    if (resultData) {
        formData.append('result_data', resultData);
    }
    if (highlightedDifferencesData) {
        formData.append('highlighted_differences_data', highlightedDifferencesData);
    }

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            "http://127.0.0.1:8000/api/comparisons/",
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
            return response.data;
        }
    } catch (error) {
        console.error("Error saving files and comparison:", error);
        throw error;
    }
}


const CompareImage = ({selectedProject}) => {
  const [source1, setSource1] = useState('assets/images/logo-main2.png');
  const [source2, setSource2] = useState('assets/images/logo-main2.png');
  const [compareResult, setCompareResult] = useState(null);
  const [editorInstance1, setEditorInstance1] = useState(null);
  const [editorInstance2, setEditorInstance2] = useState(null);
  const hiddenFileInput1 = useRef(null);
  const hiddenFileInput2 = useRef(null);
  const [editedImage1, setEditedImage1] = useState('assets/images/logo-main2.png'); // State to hold the edited image
  const [editedImage2, setEditedImage2] = useState('assets/images/logo-main2.png'); // State to hold the edited image
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const convertToFile1 = async () => {
    try {
      const response = await fetch(editedImage1);
      const blob = await response.blob();
      const file = new File([blob], 'logo-main1.png', { type: blob.type });
      setFile1(file);
    } catch (error) {
      console.error('Error converting image URL to file:', error);
    }
  };
  const convertToFile2 = async () => {
    try {
      const response = await fetch(editedImage2);
      const blob = await response.blob();
      const file = new File([blob], 'logo-main2.png', { type: blob.type });
      setFile2(file);
    } catch (error) {
      console.error('Error converting image URL to file:', error);
    }
  };

  if (editedImage1) {
    convertToFile1();
  }
  if (editedImage2) {
    convertToFile2();
  }

  const CDN_URL = "https://scaleflex.cloudimg.io/v7/plugins/filerobot-image-editor/latest/filerobot-image-editor.min.js";

  const loadEditorScript = async () => {
    try {
      if (!window.FilerobotImageEditor) {
        await loadScript(CDN_URL);
        console.log("FilerobotImageEditor loaded successfully.");
      }
    } catch (error) {
      console.error("Failed to load FilerobotImageEditor:", error);
    }
  };
  const closeImgEditor1 = () => {
    document.getElementById("first-editor").remove();
  };
  const closeImgEditor2 = () => {
    document.getElementById("second-editor").remove();
  };


  const initializeEditor1 = async (source, onSave, parent) => {
    await loadEditorScript(); // Ensure the script is loaded
    if (!window.FilerobotImageEditor) {
      console.error("FilerobotImageEditor is not available.");
      return;
    }
    const { TABS, TOOLS } = window.FilerobotImageEditor;

    const config = {
      tabsIds: [TABS.ADJUST, TABS.RESIZE, TABS.FILTERS, TABS.FINETUNE, TABS.ANNOTATE],
      defaultTabId: TABS.ADJUST,
      defaultToolId: TOOLS.TEXT,
      source: source,
      annotationsCommon: {
        fill: "#ff0000",
        scale: { x: 1, y: 1 },
      },
      removeSaveButton: false,
      savingPixelRatio: 20,
      previewPixelRatio: 4,
      defaultSavedImageQuality: 1,
      onClose: () => {
        closeImgEditor1();
        document.getElementById("first-image").style.display = "flex";
        setEditorInstance1(null);
      },
      onSave: (editedImageObject) => {
        onSave(editedImageObject.imageBase64);
      },
    };

    const editorContainer = document.createElement("div");
    editorContainer.style.width = "100%";
    editorContainer.style.height = "100%";
    editorContainer.style.margin = "auto";
    editorContainer.setAttribute('id', 'first-editor');
    document.getElementById("first-image").style.display="none";
    document.getElementById(parent).appendChild(editorContainer);

    const filerobotImageEditor = new window.FilerobotImageEditor(editorContainer, config);
    setEditorInstance1(filerobotImageEditor);
    filerobotImageEditor.render();
  };

  const initializeEditor2 = async (source, onSave, parent) => {
    await loadEditorScript(); // Ensure the script is loaded

    if (!window.FilerobotImageEditor) {
      console.error("FilerobotImageEditor is not available.");
      return;
    }

    const { TABS, TOOLS } = window.FilerobotImageEditor;

    const config = {
      tabsIds: [TABS.ADJUST, TABS.RESIZE, TABS.FILTERS, TABS.FINETUNE, TABS.ANNOTATE],
      defaultTabId: TABS.ADJUST,
      defaultToolId: TOOLS.TEXT,
      source: source,
      annotationsCommon: {
        fill: "#ff0000",
        scale: { x: 1, y: 1 },
      },
      removeSaveButton: false,
      savingPixelRatio: 20,
      previewPixelRatio: 4,
      defaultSavedImageQuality: 1,
      onClose: () => {
        closeImgEditor2();
        document.getElementById("second-image").style.display = "flex";
        setEditorInstance2(null);
      },
      onSave: (editedImageObject) => {
        onSave(editedImageObject.imageBase64);
      },
    };
    const editorContainer = document.createElement("div");
    editorContainer.style.width = "100%";
    editorContainer.style.height = "100%";
    editorContainer.style.margin = "auto";
    editorContainer.setAttribute('id', 'second-editor')
    document.getElementById("second-image").style.display="none";
    document.getElementById(parent).appendChild(editorContainer);

    const filerobotImageEditor = new window.FilerobotImageEditor(editorContainer, config);
    setEditorInstance2(filerobotImageEditor);
    filerobotImageEditor.render();
  };

  const handleClick1 = () => hiddenFileInput1.current.click();
  const handleClick2 = () => hiddenFileInput2.current.click();

  const handleFileChange = (e, fileNumber) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileURL = URL.createObjectURL(file);
    if (fileNumber === 1) {
      setFile1(file);
      setSource1(fileURL);
      setEditedImage1(fileURL);
    } else {
      setFile2(file);
      setSource2(fileURL);
      setEditedImage2(fileURL);
    }
  };

  const handleEditImage1 = () => {
    if(!editorInstance1){
      initializeEditor1(source1, (editedImage) => setEditedImage1(editedImage), "first-image-editor");
    }
  };
  const handleEditImage2 = () => {
    if(!editorInstance2){
      initializeEditor2(source2, (editedImage) => setEditedImage2(editedImage), "second-image-editor");
    }
  }

  const handleCompare = async () => {
    if (!editedImage1 || !editedImage2) {
      alert("Please upload both files before comparing.");
      return;
    }
    try {
      const base64ToFile = (base64String, fileName) => {
        const byteString = atob(base64String.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new File([ab], fileName, { type: "image/png" });
      };
      if(editedImage1.startsWith('data:image') || editedImage2.startsWith('data:image')){
        if(editedImage1.startsWith('data:image')){
          setFile1(base64ToFile(editedImage1, "image1.png"));
        }
        if(editedImage2.startsWith('data:image')){
          setFile2(base64ToFile(editedImage2, "image2.png"));
        }
        
        const result = await compareImage(file1, file2);
        if (result.highlighted_differences_url) {
          const uniqueURL = `${API_BASE_URL}${result.highlighted_differences_url}?t=${new Date().getTime()}`;
          setCompareResult(uniqueURL);
          alert("Comparison successful.");
        } else {
          if (result.error) alert(result.error);
        }
      }else{
        const result = await compareImage(file1, file2);
        if (result.highlighted_differences_url) {
          const uniqueURL = `${API_BASE_URL}${result.highlighted_differences_url}?t=${new Date().getTime()}`;
          setCompareResult(uniqueURL);
          alert("Comparison successful.");
        } else {
          if (result.error) alert(result.error);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

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
            comparisonType: 'image', // or 'image' or 'pdf'
            resultData: '', // Your comparison result binary data
            highlightedDifferencesData: highlightedDifferencesData, // Your highlighted differences binary data
        });

        if (result) {
            console.log('Comparison saved successfully:', result);
        }
    } catch (error) {
        console.error('Failed to save comparison:', error);
    }
  };

  // Helper function to map MIME types to your file types
  function getFileType(mimeType) {
      if (mimeType.startsWith('image/')){
        return 'image';
      };
      if (mimeType.startsWith('text/')) return 'text';
      if (mimeType === 'application/pdf') return 'pdf';
      return 'text'; // default fallback
  }


  return (
    <>
      <Grid2 container spacing={2} size={12}>
        {/* First Image Section */}
        <Grid2 size={6}
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
          }}
          id="first-image-editor"
        >
          <Box id="first-image">
            {source1 && (
                <img src={source1} alt="Source 1" style={{ maxWidth: "100%", maxHeight:"100%" }} />
            )}
          </Box>
        </Grid2>

        {/* Second Image Section */}
        <Grid2 size={6}
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
          }}
          id="second-image-editor"
        >
          <Box id="second-image">
            {source2 && (
                <img src={source2} alt="Source 2" style={{ maxWidth: "100%" }} />
            )}
          </Box>
        </Grid2>
      </Grid2>

      <Grid2 container justifyContent={"center"} size={12}>
        <Grid2 size={6}>
          <Box sx={{ display:'flex', justifyContent: 'center'}}>
            <Button
              variant="outlined"
              component="label"
              onClick={handleClick1}
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 1 , ml: 2}}
              size="small"
            >
              Upload first image  
            </Button>
            <input
              type="file"
              accept="image/*, .pdf"
              onChange={(e) => handleFileChange(e, 1)}
              ref={hiddenFileInput1}
              style={{ display: 'none' }} // Hide the actual input
            />
            <Button  onClick={handleEditImage1} variant="contained" size="small" sx={{ mt: 1, ml: 2 }}
              color="success"
            >
              Edit image
            </Button>
          </Box>

          {editedImage1 && (
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 2, width: "100%", height: "100%" }}>
              <h3>selected Image:</h3>
              <img src={editedImage1} alt="Edited" style={{ maxWidth: "20%", height: "auto" }} />
            </Box>
          )}
        </Grid2>
        <Grid2 size={6}>
          <Box sx={{ display:'flex', justifyContent: 'center'}}>
            <Button
              variant="outlined"
              component="label"
              onClick={handleClick2}
              startIcon={<CloudUploadIcon />}
              size="small" 
              sx={{ mt: 1 , ml:2}}
            >
              Upload second image
            </Button>
            <input
              type="file"
              accept="image/*, .pdf"
              onChange={(e) => handleFileChange(e, 2)}
              ref={hiddenFileInput2}
              style={{ display: 'none' }} // Hide the actual input
            />
            <Button  onClick={handleEditImage2} variant="contained" sx={{ mt: 1, ml: 2 }} size="small"
              color="success"
            >
                  Edit image
            </Button>
          </Box>
                
          {editedImage2 && (
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 2, width: "100%", height: "100%" }}>
              <h3>selected Image:</h3>
              <img src={editedImage2} alt="Edited" style={{ maxWidth: "20%", height: "auto" }} />
            </Box>
          )}
        </Grid2>
      </Grid2>

      <Grid2 container justifyContent={"center"} size={12} sx={{display:'flex', flexDirection:'column'}}>
        <Box textAlign="center" marginTop={3}>
          <Button variant="contained" color="primary" onClick={handleCompare}>
            Compare Images
          </Button>
        </Box>

        {compareResult && (
          <Box textAlign="center" marginTop={3}>
            <Box sx={{ display: "wrap-content", justifyContent: "center", mb: 2}}>
              <h3 style={{marginRight: '10px'}}>Comparison Result:</h3>
              <Button onClick={handleSave} variant="outlined" color="success" size="small">Save Comparison</Button>
            </Box>
            <img src={compareResult} alt="Comparison Result" style={{ maxWidth: "100%" }} />
          </Box>
        )}
      </Grid2>
    </>
  );
};

export default CompareImage;
