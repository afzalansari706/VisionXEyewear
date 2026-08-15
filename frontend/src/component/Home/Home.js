import React, { Fragment, useEffect } from 'react'
import { CgMouse } from 'react-icons/all';
import "./Home.css";
import Product from "./Product.js";
import MetaData from '../layout/MetaData.js';
import {getProduct} from "../../actions/productAction";
import {useSelector,useDispatch} from "react-redux";





const Home = () => {
  const dispatch = useDispatch(); //basically it was dispatch our request from productAction 
  const {loading,error,products,productsCount}= useSelector((state)=>state.products);

  useEffect(() => {

    dispatch(getProduct());
  }, [dispatch]);
  

  return (
    <Fragment>
      {loading ? "loading":
      (<Fragment>
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

      {products && products.map((product) => <Product product={product}/>)}
      

    </div>
  </Fragment>
   )}
    </Fragment>
  );
};

export default Home