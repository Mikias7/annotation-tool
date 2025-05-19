import React, { createContext, useState, useContext } from "react";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imageURLs, setImageURLs] = useState([]);

  return (
    <ImageContext.Provider value={{ imageURLs, setImageURLs }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);
