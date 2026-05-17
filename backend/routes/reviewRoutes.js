import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

/* GET ALL REVIEWS */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({
      createdAt: -1
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews"
    });
  }
});

/* ADD REVIEW */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      text,
      rating,
      reviewKey
    } = req.body;

    if (
      !name ||
      !text ||
      !rating ||
      !reviewKey
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const review =
      await Review.create({
        name,
        text,
        rating,
        reviewKey
      });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add review"
    });
  }
});

/* EDIT OWN REVIEW ONLY */
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      text,
      rating,
      reviewKey
    } = req.body;

    const review =
      await Review.findById(
        req.params.id
      );

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    if (
      review.reviewKey !==
      reviewKey
    ) {
      return res.status(403).json({
        message:
          "You can edit only your own review"
      });
    }

    review.name = name;
    review.text = text;
    review.rating = rating;

    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to update review"
    });
  }
});

/* DELETE REVIEW */
router.delete("/:id", async (req, res) => {
  try {
    const {
      reviewKey,
      ownerSecret
    } = req.body;

    const review =
      await Review.findById(
        req.params.id
      );

    if (!review) {
      return res.status(404).json({
        message:
          "Review not found"
      });
    }

    const isOwner =
      ownerSecret ===
      process.env
        .OWNER_SECRET;

    const isReviewOwner =
      review.reviewKey ===
      reviewKey;

    if (
      !isOwner &&
      !isReviewOwner
    ) {
      return res.status(403).json({
        message:
          "Not allowed to delete this review"
      });
    }

    await Review.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Review deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to delete review"
    });
  }
});

export default router;