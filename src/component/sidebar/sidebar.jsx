// sidebar.jsx
import { List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import { PhotoAlbum, Image, Dashboard } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { bluegray } from '../../themes/color';

const Sidebar = () => {
  const sidebarWidth = 220;

  return (
    <Box
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        bgcolor: bluegray[50], 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', 
      }}
    >
      <List>
        {[{ text: 'Dashboard', icon: <Dashboard />, path: '/' },
          { text: 'Albums', icon: <PhotoAlbum />, path: '/albums' },
          { text: 'Photos', icon: <Image />, path: '/photos' }].map((item, index) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={index} 
            sx={{
              '&:hover': { bgcolor: bluegray[700], color: '#fff' }, 
              '&:hover .MuiListItemIcon-root': { color: '#fff' },  
              '&.Mui-selected': { bgcolor: bluegray[700], color: '#fff' }, 
            }}
          >
            <ListItemIcon sx={{ color: bluegray[700] }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ color: bluegray[700], '&:hover': { color: bluegray[50] } }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
