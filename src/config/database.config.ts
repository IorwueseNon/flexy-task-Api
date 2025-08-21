
import moongoose from "mongoose";
import { config } from "./app.config";

const connectToDatabase = async () =>{
     try{
            await moongoose.connect(config.MONGO_URL)
            console.log("Connected to MongoDB successfully");
     }catch(error){
            console.error("Error connecting to the database:", error);
            throw error;
     }
}

export default connectToDatabase;