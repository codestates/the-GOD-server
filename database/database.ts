import { ENV } from "@config";
import mongoose from "mongoose";

//import { UserModel } from "./users/users.model";
let database: mongoose.Connection;
const uri = ENV.DATABASE_URL || 'mongodb+srv://eeyoontaek:512mdkmdk!@cluster0.pgiec.mongodb.net/test';
export const connect = () => {
// add your own uri below
//몽구스에서 특정 데이터베이스에 연결할 때 계정을 인증받을 데이터베이스를 별도로 적어줘야함
  
if (database) {
    return;
  }
mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
database = mongoose.connection;
database.once("open", async () => {
    console.log("Connected to database");
  });
database.on("error", () => {
    console.log("Error connecting to database");
  });
};


export const disconnect = () => {
if (!database) {
    return;
  }
mongoose.disconnect();
};