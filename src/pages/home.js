import React from "react";
import backgroundImg from '../assets/background.jpeg';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/navbar';
import './home.css';


const Home = () =>{

    const navigate = useNavigate();

    return (
        <div className="home-container">
  <Navbar />

  <div className="home-content">
    <h1>Annotation Tool</h1>
    <h3>Pose Detection</h3>
  </div>

  <div className="home-image">  
    <img src={backgroundImg} alt='pose detection sample image' />
  </div>

  <div className="home-buttons">
    <button onClick={() => navigate("/canvas")}>Continue Annotation</button>
    <button onClick={() => navigate("/upload")}>Upload Image</button>
  </div>
</div>

    );
}

export default Home;