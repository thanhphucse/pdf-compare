import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Typography,
    Pagination,
    TableFooter,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const ProjectViews = ({onProjectView}) => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/projects?page=${page}&per_page=${rowsPerPage}`);
                setProjects(response.data.results);
                setTotalPages(response.data.total_pages);
                setTotalCount(response.data.count);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [page, rowsPerPage]); // Refetch when page or rowsPerPage changes

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        setPage(1); // Reset to first page when changing rows per page
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

    const handleOnProjectView = (project) => {
        onProjectView(project);
        navigate("/images");
    };
    
    const styles = {
        tableContainer: {
            margin: '110px auto',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '8px',
            overflow: 'hidden'
        },
        header: {
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        headerCell: {
            fontWeight: 'bold',
            backgroundColor: '#f8fafc',
            color: '#475569'
        },
        row: {
            '&:hover': {
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
            }
        },
        cell: {
            fontSize: '0.875rem',
            color: '#475569'
        },
        nameCell: {
            fontWeight: '500',
            color: '#1e293b'
        },
        description: {
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        footer: {
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #e5e7eb'
        },
        paginationInfo: {
            color: '#6b7280',
            fontSize: '0.875rem'
        }
    };

    return (
        <div style={styles.tableContainer}>
            <div style={styles.header}>
                <Typography variant="h5" component="h2">
                    Project List
                </Typography>
                <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                    <InputLabel>Rows per page</InputLabel>
                    <Select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        label="Rows per page"
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={styles.headerCell}>ID</TableCell>
                            <TableCell style={styles.headerCell}>Name</TableCell>
                            <TableCell style={styles.headerCell}>Description</TableCell>
                            <TableCell style={styles.headerCell}>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No projects found</TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project) => (
                                <TableRow 
                                    key={project.id}
                                    sx={styles.row}
                                    onClick={() => handleOnProjectView(project)}
                                >
                                    <TableCell style={styles.cell}>
                                        #{project.id}
                                    </TableCell>
                                    <TableCell style={{...styles.cell, ...styles.nameCell}}>
                                        {project.name}
                                    </TableCell>
                                    <TableCell>
                                        <div style={{...styles.cell, ...styles.description}}>
                                            {project.description}
                                        </div>
                                    </TableCell>
                                    <TableCell style={styles.cell}>
                                        {formatDate(project.created_at)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Box style={styles.footer}>
                                    <div style={styles.paginationInfo}>
                                        Showing {projects.length} of {totalCount} items
                                    </div>
                                    <Pagination 
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        shape="rounded"
                                    />
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ProjectViews;