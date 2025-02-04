import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AppBar, Box, CssBaseline, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Dashboard as DashboardIcon, PhotoAlbum as PhotoAlbumIcon, Image as ImageIcon } from "@mui/icons-material";
import { bluegray } from "../../themes/color"; // Atur warna sesuai dengan preferensi Anda

const sidebarWidth = 220;

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(null); // Track active index
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { text: "Albums", path: "/albums", icon: <PhotoAlbumIcon /> },
    { text: "Photos", path: "/photos", icon: <ImageIcon /> },
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setOpenDialog(false);
    setOpenSuccessDialog(true);
    console.log("isAuthenticated:", sessionStorage.getItem("isAuthenticated"));
    console.log("Role after logout:", sessionStorage.getItem("role"));
  };

  const handleCancelLogout = () => {
    setOpenDialog(false);
  };

  const handleSuccessOk = () => {
    setTimeout(() => {
      navigate("/login", { replace: true });
      setOpenSuccessDialog(false);
    }, 100);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar / Navbar */}
      <AppBar position="fixed" sx={{ bgcolor: bluegray[700] }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{
              marginRight: 5,
              display: "none",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gallery
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          position: "fixed",
          top: "64px", // Menambahkan jarak untuk menghindari tumpang tindih dengan navbar
          left: 0,
          right: 0,
          height: "calc(100vh - 64px)", // Mengurangi tinggi sidebar agar tidak tumpang tindih dengan navbar
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          backgroundColor: "#fff",
          paddingRight: 0, // Mengurangi jarak di sisi kanan
        }}
      >
        <Divider />

        {/* Sidebar Menu */}
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              component={NavLink}
              to={item.path}
              key={index}
              onClick={() => setActiveIndex(index)} // Set the active index on click
              sx={{
                // Apply active item styles
                bgcolor: activeIndex === index ? bluegray[700] : 'transparent',
                color: activeIndex === index ? '#fff' : bluegray[700],  // Active item text color
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeIndex === index ? '#fff' : bluegray[700], // Active icon color
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: activeIndex === index ? '#fff' : bluegray[700],  // Active item text color
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Spacer to push the profile avatar to the bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Avatar Menu */}
        <Box sx={{ padding: 2, borderTop: "1px solid #e0e0e0" }}>
          <Avatar
            sx={{ bgcolor: bluegray[700], cursor: "pointer", mx: "auto" }}
            onClick={handleMenuClick}
          >
            A
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Main Content Area with Outlet */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${sidebarWidth}px`,
          paddingTop: "64px", // to avoid overlap with AppBar
          overflowY: "auto",
          height: "100vh",
        }}
      >
        <Outlet />
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelLogout}>
        <DialogTitle>{"Are you sure you want to logout?"}</DialogTitle>
        <DialogContent>
          <Typography>Once logged out, you will be redirected to the login page.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleCancelLogout} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog after logout */}
      <Dialog open={openSuccessDialog} onClose={handleSuccessOk}>
        <DialogTitle>{"Logout Successful"}</DialogTitle>
        <DialogContent>
          <Typography>You have successfully logged out. Redirecting to login page...</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleSuccessOk} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
