class ApiFeatures{//feature like search ,filter ,etc
    constructor(query,queryStr){
        this.query = query; // e.g In controller we have getallproduct(find()) that is our query
        this.queryStr = queryStr;// e.g In postman request url key=value so our value is queryStr which come from key
    }

    search(){
        const keyword = this.queryStr.keyword ? { 
            name:{
                $regex:this.queryStr.keyword,// Like in search we got auto recomand
                $options: "i",// make search case insensitive

            }
        }:{};

        this.query = this.query.find({...keyword});
        return this; // means it will return entire funtion
    }

    filter(){
        const queryCopy = {...this.queryStr} //if i didnt put it in curly brac so when querycopy change then queryStr also change 
        

        // Removing some fields for category keyword=lense&category=Candy2 like here after removing lense 
        // it will only show Candy2 types of product
        const removeFields = ["keyword","page","limit"];

        removeFields.forEach(key=>delete queryCopy[key]);

        // Filter for price and rating

        
        let queryStr = JSON.stringify(queryCopy); //converting queryCopy(e.g price gt) into string bcoz it is an object
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)//its convert gt into $gt bcoz mongo work with $sign




        this.query = this.query.find(JSON.parse(queryStr));//converting string to object

        
        return this;


    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1; 
        //logic assume we have 50 product and 5 page so on 2nd page it should be 11 - 20 productslike 10 products on each page
        const skip = resultPerPage * (currentPage - 1); // if we chg page it will skip product of other page

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this;

    }
}

module.exports = ApiFeatures