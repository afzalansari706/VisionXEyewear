import {createStore,combineReducers,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import { productDetailsReducer, productReducer } from "./reducers/productReducer";



const reducer = combineReducers({
    products : productReducer,
    productDetails: productDetailsReducer,

});//like we have to make many reducer i.e backend product,user ,etc

let initailState = {}

const middleware = [thunk];

const store = createStore(
    reducer,
    initailState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;