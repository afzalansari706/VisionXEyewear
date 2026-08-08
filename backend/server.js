const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

//Handling Uncaught Exception (basically when variable name is not define but still try to printing it(undefine error))
process.on("uncaughtException",(err)=> {
    console.log(`Error : ${err.message}`);
    console.log(`Shuting down the server due to Uncaught Exception `);
    process.exit(1);
})



//Config

dotenv.config({path:"backend/config/config.env"});

//Connecting to database 
connectDatabase()

const server = app.listen(process.env.PORT,()=>{

    console.log(`Server is working on http://localhost:${process.env.PORT}`)
});



// Unhandled Promise Rejection like if we give our server name wrong like in config env mongodb name
process.on("unhandledRejection",err=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shuting down the server due to unhandled Promise Rejection `);

    server.close(()=> {
        process.exit(1);
    })
})
