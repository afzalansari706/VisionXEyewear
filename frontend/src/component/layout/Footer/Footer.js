import React from 'react';
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css"


const Footer = () => {
  return (
    <footer id="footer">
        <div class="leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for Andriod and IOS mobile phone</p>
            <img src={playStore} alt='playStore'/>
            <img src={appStore} alt='AppStore'/>

        </div>

        <div class="midFooter">
            <h1>VisionX Eyewear</h1>
            <p>Sometime Eyewear is My Wear</p>

            <p>Copyright 2026 &copy; Afzal</p>
            
        </div>
        
        <div class="rightFooter">
            <h4>Follow Us </h4>
            <a href="http://www.youtube.com/@_dissimilar_">YouTube</a>
            <a href="http://www.youtube.com/@_dissimilar_">Instagram</a>
            <a href="http://www.youtube.com/@_dissimilar_">LinkedIn</a>
            
        </div>


    </footer>
    
  );
};

export default Footer;