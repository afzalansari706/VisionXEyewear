import React, { Fragment, useEffect } from 'react'
import { CgMouse } from 'react-icons/all';
import "./Home.css";
import Product from "./Product.js";
import MetaData from '../layout/MetaData.js';
import { getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.js";
import {useAlert} from "react-alert";


const Home = () => {
  const alert = useAlert(); // alertprovider from index.js will give use error happen in app.js or entire website

  const dispatch = useDispatch(); //basically it was dispatch our request from productAction 
  const { loading, error, products, productsCount } = useSelector((state) => state.products);

  useEffect(() => {
    if(error){
      return alert.error(error);
    }
    dispatch(getProduct());
  }, [dispatch,error]);


  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) :
        (<Fragment>
          <MetaData title="VisionX Eyewear" />

          <div className="banner">
            <p>Welcome To VisionX EyeWear</p>
            <h1>FIND AMAZING GLASSES BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>
          <h2 className='homeHeading'>Featured Products</h2>

          <div className='container' id='container'>

            {products && products.map((product) => <Product product={product} />)}


          </div>
        </Fragment>
        )}
    </Fragment>
  );
};

export default Home