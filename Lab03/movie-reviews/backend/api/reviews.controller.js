import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const movieId = req.body.movie_id;
      const review = req.body.review;
      const userInfo = req.body.userinfo;
      const date = new Date();

      const reviewResponse = await ReviewsDAO.addReview(
        movieId,
        userInfo,
        review,
        date,
      );

      if (reviewResponse.error) {
        throw reviewResponse.error;
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const review = req.body.review;
      const userId = req.body.user_id;
      const date = new Date();

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        userId,
        review,
        date,
      );

      if (reviewResponse.error) {
        throw reviewResponse.error;
      }

      if (reviewResponse.modifiedCount === 0) {
        throw new Error("unable to update review");
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.body.review_id || req.query.id;
      const userId = req.body.user_id || req.query.user_id;

      const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);

      if (reviewResponse.error) {
        throw reviewResponse.error;
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
