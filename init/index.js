const mongoose = require("mongoose");
const initData = require("./data.js");
const listing= require("../models/listing.js");



main().then((res)=>{
    console.log("connected to DB");
    
    })
    
    .catch((err) => { console.log(err)
    });
    
    async function main() {
      await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    }


    const initDb = async() =>{
        await listing.deleteMany({});
        initData.data=initData.data.map((obj)=>({...obj,owner:'662574d2be1e59c11a1c8d56'}));
        await listing.insertMany(initData.data);
        console.log("data was installed");
    };

    initDb();