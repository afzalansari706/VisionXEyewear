module.exports = theFunc => (req,res,next)=>{
    //in this file we catch error relate to database like fetching or putting wrong info 
    // after catching it goes to error.js file where it show err.message

    Promise.resolve(theFunc(req,res,next)).catch(next);
}