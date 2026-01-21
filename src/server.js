import {app} from "./app.js"
import env from "./config/env.js"
import connectDB from "./config/database.js"

connectDB();

app.listen(env.PORT,()=>{
     console.log(`Server running on port ${env.PORT}`);
})


