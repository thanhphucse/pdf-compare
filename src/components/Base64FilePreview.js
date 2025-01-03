import React from 'react';
import { Grid2 } from "@mui/material";

const Base64FilePreview = ({ Base64Data }) => {
    // Helper function to create a data URI
    const createDataURI = (base64, type) => {
        return `data:${type};base64,${base64}`;
    };

    const renderPreview = () => {
        if (!Base64Data?.data || !Base64Data?.type) {
            return <p>Invalid or missing data</p>;
        }

        try {
            switch (Base64Data.type) {
                case 'image':
                    return <img src={createDataURI(Base64Data.data, 'image/png')} alt="Preview" />;
                case 'pdf':
                    return <iframe
                        src={createDataURI(Base64Data.data, 'application/pdf')}
                        title="PDF Preview"
                        style={{ width: '100%', height: 'auto' }}
                    />;
                case 'text':
                    // Decode base64 string for plain text
                    const decodedText = atob(Base64Data.data);
                    // return <pre>{decodedText}</pre>;
                    return <Grid2 container size={12} dangerouslySetInnerHTML={{ __html: decodedText }}/>
                default:
                    return <p>Unsupported file type</p>;
            }
        } catch (error) {
            return <p>Error rendering file: {error.message}</p>;
        }
    };

    return <>{renderPreview()}</>;
};

export default Base64FilePreview;
