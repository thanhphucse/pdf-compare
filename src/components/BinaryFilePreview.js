import React, { useState, useEffect } from 'react';
import {FileText, Image, FileIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
const BinaryFilePreview = ({ fileId, fileType, fileName, open_default=false }) => {
  const [fileContent, setFileContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(open_default);

  const fetchFileContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/files/${fileId}/content/`, {
        responseType: fileType === 'pdf' ? 'blob' : 'json',
      });
      
      if (fileType === 'pdf') {
        setFileContent(URL.createObjectURL(response.data));
      } else {
        setFileContent(response.data.data);
      }
    } catch (err) {
      setError('Failed to load file');
      console.error('Error loading file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFileContent();
    }
    return () => {
      if (fileType === 'pdf' && fileContent) {
        URL.revokeObjectURL(fileContent);
      }
    };
  }, [isOpen]);

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 text-center p-4">
          {error}
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <img
            src={fileContent}
            alt={fileName}
            className="max-w-full max-h-[80vh] object-contain"
          />
        );
      
      case 'pdf':
        return (
          <iframe
            src={fileContent}
            title={fileName}
            width="100%"
            height="auto"
          />
        );
      
      case 'text':
        return (
          <div className="h-[80vh] w-full w-full overflow-scroll bg-white rounded">
            <div className="min-w-[600px]"> {/* Ensures horizontal scroll if content is wide */}
              <pre className="whitespace-pre p-4 font-mono text-sm">
                {fileContent}
              </pre>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-gray-500 text-center p-4">
            Preview not available
          </div>
        );
    }
  };

  return (
    <div className="flex items-center">
      <div 
        onClick={() => setIsOpen(true)} 
        className="cursor-pointer flex items-center gap-2"
        title={fileName}
      >
        <span className="text-sm text-gray-600 truncate max-w-[120px]">
          {fileName}
        </span>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4">
            <div className="p-4 border-b flex justify-between items-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                close
              </button>
            </div>
            <div className="p-4">
              {renderPreview()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BinaryFilePreview;