import * as React from 'react';
import { Link } from "react-router-dom"; // Import Link for routing
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";

import NewProjectForm from "./NewProjectForm";
import ProjectViews from './ProjectViews';
import { setCreateNewProjectFlag } from "../pages/HomePage";

const pages = [
  { 
    name: "Project", 
    path: "/",
    submenu: [
      { name: "Open project", path: "/open-project" },
      { name: "New project", path: "/new-project" },
    ]
  },
  { name: "Images", path: "/images" },
  { name: "Text", path: "/text" },
  { name: "Pdf", path: "/pdf" },
];

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function TopBar({ isAuthenticated, onSignOut, setSelectedProject}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElProject, setAnchorElProject] = React.useState(null); // Add for Project menu
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (setting) => {
    handleCloseUserMenu(); 
    if (setting === "Logout") {
      onSignOut(); 
    } else {
      navigate(`/${setting.toLowerCase()}`)
    }
  };

  // Project Menu Handlers
  const handleOpenProjectMenu = (event) => {
    setAnchorElProject(event.currentTarget);
  };

  const handleCloseProjectMenu = () => {
    setAnchorElProject(null);
  };

  const handleProjectMenuClick = (path) => {
    handleCloseProjectMenu();
    if(path === "/new-project"){
      navigate("/");
      setCreateNewProjectFlag(true);
    }
    if(path === "/open-project"){
      navigate("/projects");
    }
  };

  const handleProjectView = (selectedProject) => { 
    setSelectedProject(selectedProject); // Pass selected project to parent
    navigate("/images");
  }

  return (
  <>
    <AppBar position="fixed" sx={{ bgcolor: "primary.light" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link} // Use Link to route to the home page
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              src="assets/images/logo-main2.png"
              alt="Logo"
              style={{ height: 50 }}
            />
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    {page.submenu && isAuthenticated ? ( // Check for submenu
                      <>
                        <Typography textAlign="center">{page.name}</Typography> 
                        <Menu 
                          anchorEl={anchorElProject} 
                          open={Boolean(anchorElProject)} 
                          onClose={handleCloseProjectMenu}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                          {page.submenu.map((item) => (
                            <MenuItem key={item.name} onClick={() => handleProjectMenuClick(item.path)}>
                              <Typography textAlign="center">{item.name}</Typography>
                            </MenuItem>
                          ))}
                        </Menu>
                      </>
                    ) : (
                      <Typography
                        component={Link}
                        to={page.path}
                        sx={{ textAlign: "center", textDecoration: "none", color: "primary" }}
                      >
                        {page.name}
                      </Typography>
                    )}
                  </MenuItem>
                ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <div key={page.name}> {/* Wrap in a div for submenu */}
                {page.submenu && isAuthenticated ? ( // Check for submenu
                  <>
                    <Button 
                      onClick={handleOpenProjectMenu}
                      sx={{ 
                        my: 2, 
                        color: "primary", 
                        display: "block", 
                        textDecoration: "none", 
                        fontWeight: "bold", 
                        fontSize: "1.1rem" 
                      }}
                    >
                      {page.name}
                    </Button>
                    <Menu
                      anchorEl={anchorElProject}
                      open={Boolean(anchorElProject)}
                      onClose={handleCloseProjectMenu}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                      {page.submenu.map((item) => (
                        <MenuItem key={item.name} onClick={() => handleProjectMenuClick(item.path)}>
                          <Typography textAlign="center">{item.name}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Button
                    key={page.name}
                    component={Link}
                    to={page.path}
                    sx={{
                      my: 2,
                      color: "primary",
                      display: "block",
                      textDecoration: "none",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    {page.name}
                  </Button>
                )}
                </div>
            ))}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {["Account", "Dashboard", "Logout"].map((setting) => (
                    <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ):(
              <Button component={Link} to="/sign-in" sx={{color: "black"}}>
                Sign In
              </Button>
            )}            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  </>
  );
}

export default TopBar;