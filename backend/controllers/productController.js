const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const productModel = require("../models/productModel");




//Create products -- Admin
exports.createProduct = catchAsyncErrors(async (req,res,next)=>{

    req.body.user = req.user.id; //we create product with user id so we know who create products

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
});



//Get All product
exports.getAllProducts = catchAsyncErrors(async(req,res)=>{



    const resultPerPage = 8; // it will show only 5 product on one page
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query)// req.query is our url of postman with key=value i.e queryStr
    .search() //calling function
    .filter()
    .pagination(resultPerPage);
    const products = await apiFeature.query;

    res.status(200).json({
        success:true,
        products,
        productCount,
    })

});

//Get Product Details
exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);


     if(!product){
        return next(new ErrorHander("Product not found",404));
    }


    res.status(200).json({
        success:true,
        product,
        
    })


});

//Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async(req,res,next) =>{

    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
});

//Delete Product


exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product Delete successfully "
    })
});

// Create New Review and  Update the Review 
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{
    
    const {rating,comment,productId} = req.body;//this 3 thing we get from JSON body of postman

    const review = {
        user : req.user._id,
        name: req.user.name,
        rating:Number(rating),//rating should be number
        comment,
        }
    
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString()===req.user._id.toString());
     // above in review we have user_id of reviews schema and we check it with who is giving review req

    if(isReviewed){ // means early it has reviewed or not  if review then update the review but only rating and comment
        product.reviews.forEach(rev => {
            if(rev => rev.user.toString()===req.user._id.toString())
                rev.rating=rating,
                rev.comment=comment
            
        });
    }
    else{
        product.reviews.push(review); // if not review on product then it will reviews into reviews of product schema
        product.numOfReviews = product.reviews.length
    }
    let avg = 0; // we counting overall reviews of product
    product.reviews.forEach(rev => {avg += rev.rating})
    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    });
});

//Get all Reviews of single product
exports.getProductReviews = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }
    res.status(200).json({
        success:true,
        reviews: product.reviews,
    }); 
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req,res,next)=>{

    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    //For delete we not delete reviews we just keep reviews what we want
    //filter keep only those reviews which review id from reviews table is equal to review id we provide in url
    const reviews = product.reviews.filter(rev=> rev._id.toString() !== req.query.id.toString());

    let avg = 0; // since we deleting the review review also change 
    // so what we do we will not take product.reviews instead we use only reviews

    reviews.forEach(rev => {avg += rev.rating})
    const ratings = avg/reviews.length; 

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews,
    },{
        new:true,
        runValidators:true,
        useFindAndModify : false,
    });

    res.status(200).json({
        success:true,
    }); 
});
