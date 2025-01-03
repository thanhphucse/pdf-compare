import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';  // Import React Router Link
import { Box, Link as MUILink } from '@mui/material';  // Import Material UI Link
import Stack from '@mui/material/Stack';
import { useLocation } from 'react-router-dom';
import { use } from 'react';
import { useState } from 'react';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}
const generateBreadcrumbItems = (pathname) => {
  const pathnames = pathname.split('/').filter(Boolean); // Remove empty segments
  return pathnames.map((value, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`;
    return { label: value.charAt(0).toUpperCase() + value.slice(1), path };
  });
};

export default function CustomSeparator ({ workingProject, workingTypeProject }) {
  const location = useLocation();
  const items = generateBreadcrumbItems(location.pathname);
  const breadcrumbs = [
    <MUILink
      component={RouterLink}
      underline="hover"
      key="1"
      color="inherit"
      to="/"
    >
      Home
    </MUILink>,

    workingProject && (
      <MUILink
      component={RouterLink}
      underline="hover"
      key="2"
      color="inherit"
      to="/projects"
      >
        {workingProject.name}
      </MUILink>
    ),
    
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {items.map((item, index) => (
        <li 
          key={index}
          className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}
          aria-current={index === items.length - 1 ? 'page' : undefined}
        >
          {index === items.length - 1 ? (
            <>
              {item.label}
              {(item.label === "Images" || item.label === "Text" || item.label === "Pdf") ? (
                workingTypeProject(item.label)
              ):(
                workingTypeProject(null)
              )}
            </>
          ) : (
            <MUILink
              component={RouterLink}
              to={item.path}
              underline="hover"
              color="inherit"
            >
              {item.label}
            </MUILink>
          )}
        </li>
      ))}
    </Typography>,
  ];

  return (
    <Box sx={{ display:'flex', mt:'74.8px', pl:5, backgroundColor: '#28a745', position: 'fixed', width: '100%', height: '50px', alignItems: 'center', zIndex: 1000 }}>
      <Stack spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{color: 'white'}}> 
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
    </Box>
  );
}
