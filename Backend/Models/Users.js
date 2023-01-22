import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },

    city: {
      type: String,
      require: true,
    },

    routepoints: [
      {
        type: String,
        require: true,
      },
    ],

    collage: {
      type: String,
      require: true,
    },

    followers: {
      type: Array,
      default: [],
    },

    followings: {
      type: Array,
      default: [],
    },

    number: {
      type: Number,
      require: true,
      unique: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    newMessages: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      default: "online",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
