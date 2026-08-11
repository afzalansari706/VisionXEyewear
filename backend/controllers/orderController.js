const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


//Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {

    const { shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user:req.user._id, // like user is login then he can give request to create
    });

    res.status(201).json({
        success:true,
        order,
    });

});

// get Single order -- for logged in user it will give name and email of user
exports.getSingleOrder = catchAsyncErrors(async (req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email");
     //In ordermodel we have userid 
    //from that userid it will take name and email from user database by comparing both user id

    if(!order){
        return next(new ErrorHander("Order not found with this id ",404));
    }

    res.status(200).json({
        success:true,
        order,
    })

});

// get single Order -- for logged in user

exports.myOrders = catchAsyncErrors(async (req,res,next)=>{

    const orders = await Order.find({user: req.user._id});//user id from loggin person
  

    res.status(200).json({
        success:true,
        orders,
    })

});

//get All order -- For admin
exports.getAllOrders = catchAsyncErrors(async (req,res,next)=>{

    const orders = await Order.find();// return all Orders and data of Order table/schema

    let totalAmount = 0; // like we have 10 orders so we calculate total amount of all orders
    orders.forEach(order=>{
        totalAmount+= order.totalPrice;
    });
  

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    })

});

//Update Order Status -- For admin
exports.updateOrder = catchAsyncErrors(async (req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHander("Order not found with this id ",404));
    }

    //This is for checking order status
    if(order.orderStatus==="Delivered"){

        return next(new ErrorHander("You have already delivered this order",400));
    } // Since item delivered then from stock minus the quautity of delivered item

    order.orderItems.forEach(async order=>{ //here order = order.orderItems
        await updateStock(order.product,order.quantity);
    });

    //Here we update orderStatus of our database
    order.orderStatus = req.body.status;

    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
    })

});

async function updateStock (id,quantity){

    const product = await Product.findById(id);

    product.Stock = product.Stock - quantity;

    await product.save({validateBeforeSave: false});

}

// delete Order --Admin
exports.deleteOrder = catchAsyncErrors(async (req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHander("Order not found with this id ",404));
    }

    await order.remove()

    res.status(200).json({
        success:true,
        
    })

});

