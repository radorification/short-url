import dotenv from "dotenv";
dotenv.config({
    path: "./env"
});
import connectDB from "./db/index.js";
import {app} from "./app.js"

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5001, () =>{

        console.log(`App running on port: ${process.env.PORT}`)
    }
    )
})
.catch((err) => {
    console.log("Error faced while starting the app!", err)
})