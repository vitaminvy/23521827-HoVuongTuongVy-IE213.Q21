import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const movieId = req.body.movie_id;
      const review = req.body.review || req.body.text;
      const userInfo = req.body.userinfo || {};
      const userId = userInfo.id || req.body.user_id;
      const name = userInfo.name || req.body.name;
      const date = new Date();

      if (!movieId || !review || !userId || !name) {
        res.status(400).json({ error: "Missing required review fields" });
        return;
      }

      const reviewResponse = await ReviewsDAO.addReview(
        movieId,
        userId,
        name,
        review,
        date,
      );

      if (reviewResponse.error) {
        res.status(500).json({ error: reviewResponse.error });
        return;
      }

      res.json({ status: "success" });
    } catch (e) {
      console.error(`apiPostReview, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const userId = req.body.user_id;
      const review = req.body.review || req.body.text;
      const date = new Date();

      if (!reviewId || !userId || !review) {
        res.status(400).json({ error: "Missing required review fields" });
        return;
      }

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        userId,
        review,
        date,
      );

      if (reviewResponse.error) {
        res.status(500).json({ error: reviewResponse.error });
        return;
      }

      if (reviewResponse.modifiedCount === 0) {
        throw new Error("Unable to update review - user may not be original poster");
      }

      res.json({ status: "success" });
    } catch (e) {
      console.error(`apiUpdateReview, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const userId = req.body.user_id;

      if (!reviewId || !userId) {
        res.status(400).json({ error: "Missing required review fields" });
        return;
      }

      const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);

      if (reviewResponse.error) {
        res.status(500).json({ error: reviewResponse.error });
        return;
      }

      if (reviewResponse.deletedCount === 0) {
        throw new Error("Unable to delete review - user may not be original poster");
      }

      res.json({ status: "success" });
    } catch (e) {
      console.error(`apiDeleteReview, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }
}
