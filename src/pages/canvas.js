import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import './canvas.css';

const Canvas = () => {
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const markersRef = useRef({}); // Store markers per image ID as original image coords
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);

  // Fixed display canvas size (scaled size)
  const DISPLAY_WIDTH = 600;
  const DISPLAY_HEIGHT = 400;

  // Fetch images from backend
  useEffect(() => {
    fetch('http://localhost:3002/images')
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error('Failed to fetch images:', err));
  }, []);

  // Draw image + markers on canvas with scaling
  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentImage = images[index];
    if (!currentImage) return;

    const img = new Image();
    img.src = currentImage.dataUrl;

    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate scaling to fit image into canvas while preserving aspect ratio
      const scale = Math.min(DISPLAY_WIDTH / img.naturalWidth, DISPLAY_HEIGHT / img.naturalHeight);
      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;

      // Calculate offset to center the image in canvas
      const offsetX = (DISPLAY_WIDTH - scaledWidth) / 2;
      const offsetY = (DISPLAY_HEIGHT - scaledHeight) / 2;

      // Draw the scaled image centered
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

      // Draw markers: map stored original coords to scaled coords
      const markers = markersRef.current[currentImage._id] || [];
      markers.forEach(([origX, origY], i) => {
        const scaledX = origX * scale + offsetX;
        const scaledY = origY * scale + offsetY;
        drawMarker(ctx, scaledX, scaledY, i + 1);
      });
    };
  }, [images, index]);

  // Draw marker helper
  const drawMarker = (ctx, x, y, number) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, x + 10, y);
  };

  // Handle canvas click to add marker (convert click coords to original image coords)
  const handleClick = (e) => {
    if (!canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const currentImage = images[index];
    if (!currentImage) return;

    // Load image size info for scaling calculation
    const img = new Image();
    img.src = currentImage.dataUrl;
    img.onload = () => {
      // Calculate scale and offsets same as in drawing
      const scale = Math.min(DISPLAY_WIDTH / img.naturalWidth, DISPLAY_HEIGHT / img.naturalHeight);
      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;
      const offsetX = (DISPLAY_WIDTH - scaledWidth) / 2;
      const offsetY = (DISPLAY_HEIGHT - scaledHeight) / 2;

      // Check if click is inside image area 
      if (
        clickX < offsetX || 
        clickX > offsetX + scaledWidth ||
        clickY < offsetY || 
        clickY > offsetY + scaledHeight
      ) {
        // Click outside image - ignore
        return;
      }

      // Convert click coords back to original image coords
      const origX = (clickX - offsetX) / scale;
      const origY = (clickY - offsetY) / scale;

      const imageId = currentImage._id;
      if (!markersRef.current[imageId]) {
        markersRef.current[imageId] = [];
      }

      markersRef.current[imageId].push([origX, origY]);

      // Redraw canvas to include new marker
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

      markersRef.current[imageId].forEach(([x, y], i) => {
        const scaledX = x * scale + offsetX;
        const scaledY = y * scale + offsetY;
        drawMarker(ctx, scaledX, scaledY, i + 1);
      });
    };
  };

  // Navigation and other buttons stay same, just update canvas width/height props to fixed size

  const nextImage = () => {
    if (index < images.length - 1) setIndex(index + 1);
  };

  const prevImage = () => {
    if (index > 0) setIndex(index - 1);
  };

  const removeMarker = () => {
    if (images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageId = images[index]._id;

    if (markersRef.current[imageId]?.length > 0) {
      markersRef.current[imageId].pop();

      const currentImage = images[index];
      const img = new Image();
      img.src = currentImage.dataUrl;
      img.onload = () => {
        const scale = Math.min(DISPLAY_WIDTH / img.naturalWidth, DISPLAY_HEIGHT / img.naturalHeight);
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        const offsetX = (DISPLAY_WIDTH - scaledWidth) / 2;
        const offsetY = (DISPLAY_HEIGHT - scaledHeight) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        markersRef.current[imageId].forEach(([x, y], i) => {
          const scaledX = x * scale + offsetX;
          const scaledY = y * scale + offsetY;
          drawMarker(ctx, scaledX, scaledY, i + 1);
        });
      };
    }
  };

  const clearMarkers = () => {
    if (images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageId = images[index]._id;

    if (markersRef.current[imageId]?.length > 0) {
      markersRef.current[imageId] = [];

      const currentImage = images[index];
      const img = new Image();
      img.src = currentImage.dataUrl;
      img.onload = () => {
        const scale = Math.min(DISPLAY_WIDTH / img.naturalWidth, DISPLAY_HEIGHT / img.naturalHeight);
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        const offsetX = (DISPLAY_WIDTH - scaledWidth) / 2;
        const offsetY = (DISPLAY_HEIGHT - scaledHeight) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
      };
    }
  };

  const handleDelete = async () => {
    if (images.length === 0) return;

    const imageToDelete = images[index];
    try {
      const res = await fetch(`http://localhost:3002/images/${imageToDelete._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');

      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      setIndex((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (images.length === 0) {
    return (
      <>
      <Navbar />
      <div className="empty-state">
        <h2>No Image uploaded</h2>
        <button onClick={() => navigate("/upload")}>Upload Image</button>
      </div>
      </>
    );
  }
  

  const handleSaveAnnotations = async () => {
    const annotations = markersRef.current;

    try {
      const response = await fetch('http://localhost:3002/save-annotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ annotations }),
      });

      if (!response.ok) throw new Error('Failed to save');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'annotations.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error saving annotations:', err);
    }
  };

  return (
    <div>
  <Navbar />

  <div className="canvas-navigation">
    <button onClick={prevImage} disabled={index === 0}>Previous</button>

    <canvas
      ref={canvasRef}
      width={DISPLAY_WIDTH}
      height={DISPLAY_HEIGHT}
      onClick={handleClick}
    />

    <button onClick={nextImage} disabled={index >= images.length - 1}>Next</button>
  </div>

  <div className="button-group">
    <button onClick={removeMarker} disabled={images.length === 0}>Undo</button>
    <button onClick={clearMarkers} disabled={images.length === 0}>Clear</button>
    <button onClick={handleDelete} disabled={images.length === 0}>Delete Image</button>
    <button onClick={() => navigate("/upload")}>Upload</button>
    <button onClick={handleSaveAnnotations}>Save Annotations</button>
  </div>
</div>

  

  );
};

export default Canvas;
