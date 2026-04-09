import mongoose from "mongoose";
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = () => { 
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

}
export default connectDB;
