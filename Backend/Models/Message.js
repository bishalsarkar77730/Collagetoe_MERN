import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: String,
  from: Object,
  socketid: String,
  time: String,
  date: String,
  to: String,
});

export default mongoose.model("Message", MessageSchema);
