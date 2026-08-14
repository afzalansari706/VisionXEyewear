import React, { Fragment } from 'react'
import { CgMouse } from 'react-icons/all';
import "./Home.css";
import Product from "./Product.js";
import MetaData from '../layout/MetaData.js';


const product = {
  name:"LifeTime",
  images : [{url : "https://da4e1j5r7gw87.cloudfront.net/wp-content/uploads/sites/4926/2024/04/eye-glasses.jpg"}],
  price:"4000rs",
  _id:"afzal",
}

const Home = () => {
  return <Fragment>
    <MetaData title="VisionX Eyewear"/>

    <div className="banner">
      <p>Welcome To VisionX EyeWear</p>
      <h1>FIND AMAZING GLASSES BELOW</h1>

      <a href="#container">
        <button>
          Scroll <CgMouse/>
        </button>
      </a>
    </div>
    <h2 className='homeHeading'>Featured Products</h2>

    <div className='container' id='container'>

      <Product product={product}/>
      <Product product={product}/>
      <Product product={product}/>
      <Product product={product}/>

      <Product product={product}/>
      <Product product={product}/>
      <Product product={product}/>
      <Product product={product}/>

    </div>
  </Fragment>; 
};

export default Home