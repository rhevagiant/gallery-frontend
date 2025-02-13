import { createContext, useContext, useState } from "react";

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likedPhotos, setLikedPhotos] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  const toggleLike = (fotoID) => {
    setLikedPhotos((prev) => ({
      ...prev,
      [fotoID]: !prev[fotoID],
    }));

    setLikeCounts((prev) => ({
      ...prev,
      [fotoID]: (prev[fotoID] || 0) + (likedPhotos[fotoID] ? -1 : 1),
    }));
  };

  return (
    <LikeContext.Provider value={{ likedPhotos, likeCounts, setLikeCounts, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => useContext(LikeContext);
