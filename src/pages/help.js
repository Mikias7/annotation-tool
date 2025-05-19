import React from "react";
import Navbar from "../components/navbar";
import './help.css';

const HelpPage = () => {


    return (
        <div>
            < Navbar />
            <div class="guide-container">
                <h3>How to Label Images</h3>
                <p><strong>Use a Consistent Labeling Scheme:</strong> Always follow the same order and number of markers when annotating. This ensures your annotations are usable and machine learning-ready.</p>
                <ul>
                    <li>Place markers in a consistent order (e.g., left-to-right or top-to-bottom).</li>
                    <li>Use the same number of markers per image or object.</li>
                    <li>Always associate the same marker number with the same feature (e.g., marker 1 = left eye).</li>
                </ul>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>Click on the canvas to place each marker.</li>
                    <li>Use <em>Undo</em> or <em>Clear</em> to fix mistakes.</li>
                    <li>Save your annotations with the “Save” button.</li>
                </ol>
            </div>
        </div>
    );
}

export default HelpPage;