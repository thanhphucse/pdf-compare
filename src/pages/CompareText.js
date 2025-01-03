import React, { useState } from "react";
import { Box, Button,  Grid2, Typography } from "@mui/material";
import { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import * as Diff from 'diff';
import { html } from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';
import Swal from "sweetalert2";
import axios from 'axios';
import { API_BASE_URL } from '../api';

// Helper function to handle saving text comparison
async function handleSaveTextComparison(comparisonData) {
    const { projectId, text1Data, text2Data, comparisonType, resultData, highlightedDifferencesData } = comparisonData;

    const formData = new FormData();
    formData.append('project', projectId);
    formData.append('file1_name', 'text1.txt');
    formData.append('file2_name', 'text2.txt');
    formData.append('file1_type', 'text');
    formData.append('file2_type', 'text');
    formData.append('file1_data', new Blob([text1Data], { type: 'text/plain' }), 'text1.txt');
    formData.append('file2_data', new Blob([text2Data], { type: 'text/plain' }), 'text2.txt');
    formData.append('comparison_type', comparisonType);
    formData.append('result_data', resultData);
    
    // Save the HTML diff as binary data
    if (highlightedDifferencesData) {
        formData.append('highlighted_differences_data', new Blob([highlightedDifferencesData], { type: 'text/html' }));
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
            console.log("Text comparison saved successfully:", response.data);
            return response.status;
        }
    } catch (error) {
        console.error("Error saving text comparison:", error);
        throw error;
    }
}

class ControlledEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    this.props.onChange(editorState);
  };

  render() {
    const { editorState } = this.state;
    return (
        <Editor
            editorState={editorState}
            wrapperClassName="custom-wrapper"
            editorClassName="custom-editor"
            toolbarClassName="custom-toolbar"
            onEditorStateChange={this.onEditorStateChange}
            stripPastedStyles={true}
            toolbar={{
                options: ['history']
            }}
        />
    )
  }
}

const CompareText = ({ selectedProject }) => {
  const [leftEditorContent, setLeftEditorContent] = useState(EditorState.createEmpty());
  const [rightEditorContent, setRightEditorContent] = useState(EditorState.createEmpty());
  const [diffHtml, setDiffHtml] = useState("");
  const [rawDiff, setRawDiff] = useState("");

  const getTextFromEditor = (editorState) => {
    const contentState = editorState.getCurrentContent();
    return contentState.hasText() ? contentState.getPlainText() : "";
  };

  const handleCompare = () => {
    const leftText = getTextFromEditor(leftEditorContent);
    const rightText = getTextFromEditor(rightEditorContent);

    const diff = Diff.createPatch("Comparison", leftText, rightText);
    setRawDiff(diff); // Store raw diff for saving
    console.log("Generated Diff:", diff); // Debugging Step
    const diffHtmlOutput = html(diff, { inputFormat: "diff", outputFormat: "line-by-line" });
    // console.log("Generated HTML:", diffHtmlOutput); // Debugging Step
    setDiffHtml(diffHtmlOutput);
    Swal.fire({
      icon: "success",
      title: "Comparison Successful",
      text: "The comparison result is ready.",
    });
  };

  const handleSave = async () =>{
    try {
      if (!diffHtml || !selectedProject) {
          Swal.fire({
              icon: "warning",
              title: "error",
              text: "ensure a project is selected.",
          });
          return;
      }

      const leftText = getTextFromEditor(leftEditorContent);
      const rightText = getTextFromEditor(rightEditorContent);

      const result = await handleSaveTextComparison({
          projectId: selectedProject.id,
          text1Data: leftText,
          text2Data: rightText,
          comparisonType: 'text',
          resultData: rawDiff, // Save the raw diff data
          highlightedDifferencesData: diffHtml, // Save the complete HTML with CSS
      });

      if (result===201) {
          Swal.fire({
              icon: "success",
              title: "Saved",
              text: "The comparison result has been saved.",
          });
      }
      } catch (error) {
          Swal.fire({
              icon: "error",
              title: "Error",
              text: error.toString(),
          });
      }
  };

  return (
      <>
          <Grid2 container spacing={2} size={12} sx={{ mt: 14 }}>
              <Grid2 item xs={12} sm={6} size={6}
                sx={{
                  height: "70vh",
                  padding: 2,
                }}
              >   
                <Typography>Original text</Typography>
                <ControlledEditor onChange={setLeftEditorContent}/>
              </Grid2>

              <Grid2 item xs={12} sm={6} size={6}
                sx={{
                  height: "70vh",
                  padding:2,
                }}
              >
                <Typography className="color: blue">Changed text</Typography>
                <ControlledEditor onChange={setRightEditorContent}/>
              </Grid2>
          </Grid2>
          <Grid2 container size={12} justifyContent={"center"} sx={{margin: 4}}>
            <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleCompare}
            >Compare</Button>
          </Grid2>
          {diffHtml && (
            <Grid2 container justifyContent={"center"} size={12} sx={{ mt: 3 }}>
              <Box sx={{ display: "wrap-content", justifyContent: "center", mb: 2}}>
                <h3 style={{marginRight: '10px'}}>Comparison Result:</h3>
                <Button onClick={handleSave} variant="outlined" color="success" size="small">Save Comparison</Button>
              </Box>
              <Grid2 container size={12} dangerouslySetInnerHTML={{ __html: diffHtml }}
                sx={{
                  marginTop: 2,
                  border: '1px solid #ccc',
                  padding: 10,
                  overflow: 'auto',
                  wordWrap: 'break-word', // Break long words to prevent overflow
                  maxWidth: '100%', // Prevent container from exceeding screen width
                }}
                >
              </Grid2>
            </Grid2>
            
          )}
      </>
  );
};

export default CompareText;
