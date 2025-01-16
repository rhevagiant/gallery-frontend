import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './component/sidebar/sidebar';
import AlbumList from './component/album/albumList';
import PhotoList from './component/photo/photoList';
import Dashboard from './component/dashboard/dashboard';
// import AddAlbum from './components/AddAlbum'; // Form to add a new album (optional)
// import AddPhoto from './components/AddPhoto'; // Form to add a new photo (optional)
// import NotFound from './components/NotFound'; // 404 page

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '16px' }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/albums" element={<AlbumList />} />
            <Route path="/photos" element={<PhotoList />} />

           
            {/* <Route path="/albums/add" element={<AddAlbum />} />

            
            <Route path="/photos/add" element={<AddPhoto />} />

     
            <Route path="/" element={<NotFound />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
