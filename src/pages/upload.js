import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import './upload.css';


function ImageUploader() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    const formData = new FormData();
    // NOTE: 'images' must match backend's multer array name
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('http://localhost:3002/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload success:', data);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div className="image-uploader-container">
  <Navbar />
  <input
    type="file"
    onChange={handleFileChange}
    accept="image/*"
    multiple
    className="file-input"
  />
  <div className="buttons">
    <button onClick={handleUpload} className="btn upload-btn">Upload Images</button>
    <button onClick={() => navigate("/canvas")} className="btn continue-btn">Continue to Annotation</button>
  </div>
</div>


  );
}

export default ImageUploader;
