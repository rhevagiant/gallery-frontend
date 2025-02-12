import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AppBar, Box, CssBaseline, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { Menu as MenuIcon, Dashboard as DashboardIcon, PhotoAlbum as PhotoAlbumIcon, Image as ImageIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { bluegray } from "../../themes/color"; // Sesuaikan warna sesuai preferensi Anda

const sidebarWidth = 220;

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(null); // Track active index
  const [openDialog, setOpenDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { text: "Albums", path: "/albums", icon: <PhotoAlbumIcon /> },
    { text: "Photos", path: "/photos", icon: <ImageIcon /> },
  ];

  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setOpenDialog(false);
    setOpenSuccessDialog(true);
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
          top: "64px",
          left: 0,
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
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
              onClick={() => setActiveIndex(index)}
              sx={{
                bgcolor: activeIndex === index ? bluegray[700] : "transparent",
                color: activeIndex === index ? "#fff" : bluegray[700],
              }}
            >
              <ListItemIcon sx={{ color: activeIndex === index ? "#fff" : bluegray[700] }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        {/* Spacer to push the logout icon to the bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Logout Button */}
        <Box sx={{ padding: 2, borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "center" }}>
          <IconButton sx={{color: bluegray[700]}} onClick={handleLogoutClick}>
            <LogoutIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${sidebarWidth}px`,
          paddingTop: "64px",
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