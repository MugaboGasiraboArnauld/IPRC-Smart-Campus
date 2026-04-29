const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["single", "double", "triple", "shared"],
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  available: {
    type: Number,
    default: 0,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    campus: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "mixed"],
      required: true,
    },
    facilities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    rooms: {
      type: [roomSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Hostel = mongoose.model("Hostel", hostelSchema);

module.exports = Hostel;
