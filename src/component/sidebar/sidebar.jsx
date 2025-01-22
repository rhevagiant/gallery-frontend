import { Drawer, List, ListItem, ListItemText, ListItemIcon, Toolbar } from '@mui/material';
import { PhotoAlbum, Image, Dashboard } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import AlbumList from '../album/albumList';

const Sidebar = () => {
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/albums">
          <ListItemIcon>
            <PhotoAlbum />
          </ListItemIcon>
          <ListItemText primary="Albums" />
        </ListItem>
        <ListItem button component={Link} to="/photos">
          <ListItemIcon>
            <Image />
          </ListItemIcon>
          <ListItemText primary="Photos" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
