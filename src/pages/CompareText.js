import React, { useState } from "react";
import { Button,  Grid2, Typography } from "@mui/material";
import { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import * as Diff from 'diff';
import { html } from 'diff2html'; // Correct import
import 'diff2html/bundles/css/diff2html.min.css';


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

const CompareText = () => {
  const [leftEditorContent, setLeftEditorContent] = useState(EditorState.createEmpty());
  const [rightEditorContent, setRightEditorContent] = useState(EditorState.createEmpty());
  const [diffHtml, setDiffHtml] = useState("");

  const getTextFromEditor = (editorState) => {
    const contentState = editorState.getCurrentContent();
    return contentState.hasText() ? contentState.getPlainText() : "";
  };

  const handleCompare = () => {
    const leftText = getTextFromEditor(leftEditorContent);
    const rightText = getTextFromEditor(rightEditorContent);

    const diff = Diff.createPatch("Comparison", leftText, rightText);
    console.log("Generated Diff:", diff); // Debugging Step
    const diffHtmlOutput = html(diff, { inputFormat: "diff", outputFormat: "line-by-line" });
    console.log("Generated HTML:", diffHtmlOutput); // Debugging Step
    setDiffHtml(diffHtmlOutput);
  };

    return (
        <>
            <Grid2 container spacing={2} size={12}>
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
            )}
        </>
    );
};

export default CompareText;
