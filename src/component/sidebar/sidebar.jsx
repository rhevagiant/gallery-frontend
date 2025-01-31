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
        bgcolor: bluegray[50], // Set background color to bluegray[50]
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', // Add shadow to the right side
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
              '&:hover': { bgcolor: bluegray[700], color: '#fff' }, // Hover background color
              '&:hover .MuiListItemIcon-root': { color: '#fff' },  // Hover icon color
              '&.Mui-selected': { bgcolor: bluegray[700], color: '#fff' }, // Selected item color
            }}
          >
            <ListItemIcon sx={{ color: bluegray[700] }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ color: bluegray[700], '&:hover': { color: bluegray[50] } }} // Text color changes to bluegray[50] on hover
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
