import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Select,
  MenuItem,
  Typography,
  Box,
  Button,
} from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid2,
} from "@mui/material";
import { X } from "lucide-react";

import BinaryFilePreview from "../components/BinaryFilePreview";
import Base64FilePreview from "../components/Base64FilePreview";
import { API_BASE_URL } from "../api";

const ReviewModal = ({ open, onClose, file1Id, file1Name, file2Id, file2Name, compareResult, type }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle sx={{display: "flex", justifyContent: "space-between"}}>
        <Typography variant="h6">File Comparison Review</Typography>
        <IconButton onClick={onClose} className="mt-2">
          <X className="h-4 w-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2} sx={{height:'80vh'}}>
          <Grid2 item xs={4} size={6}>
            <Typography variant="subtitle1" className="mb-2 font-medium">first File: </Typography>
            <Box className="w-full h-96 border rounded-lg" sx={{overflow: 'auto'}}>
              <BinaryFilePreview
                fileId={file1Id}
                fileType={type}
                fileName={file1Name}
                open_default={true}
              />
            </Box>
          </Grid2>
          <Grid2 item xs={4} size={6}>
            <Typography variant="subtitle1" className="mb-2 font-medium">second File: </Typography>
            <Box className="w-full border rounded-lg" sx={{overflow: 'auto'}}>
              <BinaryFilePreview 
                fileId={file2Id}
                fileType={type}
                fileName={file2Name}
                open_default={true}
              />
            </Box>
          </Grid2>
          <Grid2 item xs={4} size={12}>
            <Typography variant="subtitle1" className="mb-2 font-medium">Comparison Result</Typography>
            <Box className="w-full h-96 border rounded-lg overflow-auto">
              <Base64FilePreview
                Base64Data={{
                  type: type,
                  data: compareResult
                }}
              />
            </Box>
          </Grid2>
        </Grid2>
      </DialogContent>
    </Dialog>
  );
};


const Dashboard = ({onResetProject}) => {
  onResetProject(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  // State for Image Comparison
  const [imageComparisons, setImageComparisons] = useState([]);
  const [imagePage, setImagePage] = useState(0);
  const [imageRowsPerPage, setImageRowsPerPage] = useState(3);

  // State for Text Comparison
  const [textComparisons, setTextComparisons] = useState([]);
  const [textPage, setTextPage] = useState(0);
  const [textRowsPerPage, setTextRowsPerPage] = useState(3);

  // State for PDF Comparison
  const [pdfComparisons, setPdfComparisons] = useState([]);
  const [pdfPage, setPdfPage] = useState(0);
  const [pdfRowsPerPage, setPdfRowsPerPage] = useState(3);

  useEffect(() => {
    fetchProjects();
    fetchComparisons("image", imagePage, imageRowsPerPage, setImageComparisons);
    fetchComparisons("text", textPage, textRowsPerPage, setTextComparisons);
    fetchComparisons("pdf", pdfPage, pdfRowsPerPage, setPdfComparisons);
  }, [selectedProject, imagePage, textPage, pdfPage, imageRowsPerPage, textRowsPerPage, pdfRowsPerPage]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/projects/`);
      const projectsData = response.data.results || []; // Extract the 'results' array
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]); // Fallback to an empty array on error
    }
  };

  const fetchComparisons = async (type, page, rowsPerPage, setState) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/comparisons/`, {
        params: {
          project: selectedProject,
          comparison_type: type,
          page: page + 1,
          per_page: rowsPerPage,
        },
      });
      setState(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(`Error fetching ${type} comparisons:`, error);
    }
  };

  const handlePageChange = (setPage) => (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (setRowsPerPage, setPage) => (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
    setImagePage(0);
    setTextPage(0);
    setPdfPage(0);
  };

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState(null);

  const handleView = (type, file1_id, file1_name, file2_id, file2_name, compare_result) => {
    setSelectedComparison({
      type,
      file1_id,
      file1_name,
      file2_id,
      file2_name,
      compare_result
    });
    console.log(selectedComparison);
    setIsReviewOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this comparison?");
    if (confirm) {
      try {
        await axios.delete(`${API_BASE_URL}/api/comparisons/${id}/`);
        alert("Comparison deleted successfully.");
        fetchComparisons("image", imagePage, imageRowsPerPage, setImageComparisons); // Refresh data
        fetchComparisons("text", textPage, textRowsPerPage, setTextComparisons);
        fetchComparisons("pdf", pdfPage, pdfRowsPerPage, setPdfComparisons);
      } catch (error) {
        console.error("Error deleting comparison:", error);
        alert("Failed to delete comparison.");
      }
    }
  };
  const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

  const renderTable = (comparisons, title, page, rowsPerPage, setPage, setRowsPerPage) => (
    <Box marginBottom={4} sx={{width: "100%"}}>
      <Typography variant="h6" sx={{fontWeight:'bold', backgroundColor:'#0783f7', color:'white'}}>{title}</Typography>
      <Table>
        <TableHead>
          <TableRow sx={{backgroundColor:'#f0f0f0'}}>
            <TableCell>No.</TableCell>
            <TableCell>Project Name</TableCell>
            <TableCell>First File</TableCell>
            <TableCell>Second File</TableCell>
            <TableCell>Comparison Result</TableCell>
            <TableCell>Create at</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comparisons.results &&
            comparisons.results.map((comparison, index) => (
              <TableRow key={comparison.id}>
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>{comparison.project_name}</TableCell>
                <TableCell sx={{maxWidth: "100px", overflow: "auto"}}>
                  <BinaryFilePreview 
                    fileId={comparison.file1.id}
                    fileType={comparison.comparison_type}
                    fileName={comparison.file1_name}
                  />
                </TableCell>
                <TableCell sx={{maxWidth: "100px", overflow: "auto"}}>
                  <BinaryFilePreview 
                    fileId={comparison.file2.id}
                    fileType={comparison.comparison_type}
                    fileName={comparison.file2_name}
                  />
                </TableCell>
                <TableCell sx={{maxWidth: "100px", overflow: "hidden"}}>
                   <Base64FilePreview
                      Base64Data={{
                          type: comparison.comparison_type,
                          data: comparison.highlighted_differences_file // base64 content
                      }}
                  />
                </TableCell>
                <TableCell>
                  {formatDate(comparison.created_at)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="success"
                    style={{ marginRight: "5px" }}
                    onClick={() => handleView(
                      comparison.comparison_type,
                      comparison.file1.id,
                      comparison.file1.name,
                      comparison.file2.id,
                      comparison.file2.name,
                      comparison.highlighted_differences_file,
                      )}
                  >
                    Review
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(comparison.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={comparisons.count || 0}
        page={page}
        onPageChange={handlePageChange(setPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange(setRowsPerPage, setPage)}
        rowsPerPageOptions={[3, 5, 10, 15, 20, 25]}
      />
    </Box>
  );

  return (
    <Box padding={3} sx={{ width: "80%", margin: "120px auto" }}>
      <Box marginBottom={2}>
        <Select
          value={selectedProject}
          onChange={handleProjectChange}
          displayEmpty
          style={{ marginRight: "1rem" }}
        >
          <MenuItem value="">All Projects</MenuItem>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Render Image Comparison Table */}
      {renderTable(imageComparisons, "Image Comparisons", imagePage, imageRowsPerPage, setImagePage, setImageRowsPerPage)}

      {/* Render Text Comparison Table */}
      {renderTable(textComparisons, "Text Comparisons", textPage, textRowsPerPage, setTextPage, setTextRowsPerPage)}

      {/* Render PDF Comparison Table */}
      {renderTable(pdfComparisons, "PDF Comparisons", pdfPage, pdfRowsPerPage, setPdfPage, setPdfRowsPerPage)}

      {selectedComparison && (
        <ReviewModal
          open={isReviewOpen}
          onClose={() => {
            setIsReviewOpen(false);
            setSelectedComparison(null);
          }}
          file1Id={selectedComparison.file1_id}
          file1Name={selectedComparison.file1_name}
          file2Id={selectedComparison.file2_id}
          file2Name={selectedComparison.file2_name}
          compareResult={selectedComparison.compare_result}
          type={selectedComparison.type}
        />
      )}
    </Box>
  );
};

export default Dashboard;
