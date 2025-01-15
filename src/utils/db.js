import mongoose from "mongoose";

const connect = async () => {
    if (mongoose.connections[0].readyState) {
        console.log("Already connected to DB");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Connected to db Successfully");
    }
    catch (err) {
        console.log("Error connecting to db", err);
    }
}

export default connect