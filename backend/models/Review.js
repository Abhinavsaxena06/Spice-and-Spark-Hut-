import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    text: {
      type: String,
      required: true,
      trim: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    reviewKey: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;