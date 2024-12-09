import React, { useState } from "react";
import { Box, Typography, Button,  Grid2 } from "@mui/material";

const Text = () => {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
     const [compareResult, setCompareResult] = useState(null);

    const handleFileChange = (e, fileNumber) => {
        const file = e.target.files[0];
        if (file) {
            if (fileNumber === 1) setFile1(file);
            else setFile2(file);
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
            setCompareResult(result); // Set the comparison result to display
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

            <Grid2 container spacing={2} size={12}>
                <Grid2 item xs={12} sm={6} size={6}
                    sx={{
                        border: 1,
                        borderColor: "success.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                    }}
                >
                    <Typography variant="subtitle1">Upload First PDF:</Typography>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, 1)}
                    />
                </Grid2>

                <Grid2 item xs={12} sm={6} size={6}
                    sx={{
                        border: 1,
                        borderColor: "success.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                    }}
                >
                    <Typography variant="subtitle1">Upload Second PDF:</Typography>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, 2)}
                    />
                </Grid2>
            </Grid2>
            <Grid2 container size={12} justifyContent={"center"}>
                <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleCompare}
                >Compare</Button>
            </Grid2>
            

            {/* Display Comparison Results */}
            {compareResult && (
                <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Comparison Result:</Typography>
                {/* Replace this with your desired visualization */}
                <Typography variant="body1">
                    {JSON.stringify(compareResult)}
                </Typography>
                </Box>
            )}
        </>
    );
};

export default Text;
