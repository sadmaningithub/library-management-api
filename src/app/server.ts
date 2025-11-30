import mongoose from "mongoose";
import app from "./app";

let server;

const PORT = 5000;

async function main(){
    try {
        await mongoose.connect('mongodb+srv://libMan:PyZYg5eHIEblC2ZQ@cluster0.2vtceto.mongodb.net/?appName=Cluster0');
        console.log('Successfully connected to mongodb!');
        server = app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
    }
    catch(error){
        console.log(error);
    }
}

main();