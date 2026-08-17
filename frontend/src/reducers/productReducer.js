import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    CLEAR_ERRORS
} from "../constants/productConstants"; //this are the actions type



export const productReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case ALL_PRODUCT_REQUEST:

            return {
                loading: true,
                products: []
            };
        case ALL_PRODUCT_SUCCESS:

            return {
                loading: false,
                products: action.payload.products, //This payload is come from action folder 
                productsCount: action.payload.productsCount,
            };
        case ALL_PRODUCT_FAIL:

            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:

            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }

};
// for geting a single product details
export const productDetailsReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:

            return {
                loading: true,
                ...state,
            };
        case PRODUCT_DETAILS_SUCCESS:

            return {
                loading: false,
                product: action.payload, //This for fetching product details 
                
            };
        case PRODUCT_DETAILS_FAIL:

            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:

            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }

};