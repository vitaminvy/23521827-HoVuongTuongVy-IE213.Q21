import mongodb from "mongodb";
import { mockReviews } from "../data/mockData.js";

const ObjectId = mongodb.ObjectId;
let reviews;
let useMockData = false;

export default class ReviewsDAO {
  static useMockData() {
    useMockData = true;
  }

  static async injectDB(conn) {
    if (reviews) {
      return;
    }

    try {
      reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection("reviews");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in ReviewsDAO: ${e}`,
      );
    }
  }

  static async addReview(movieId, userId, name, review, date) {
    if (useMockData) {
      mockReviews.push({
        _id: new ObjectId().toString(),
        name: name,
        user_id: userId,
        date: date,
        text: review,
        movie_id: movieId,
      });

      return { acknowledged: true };
    }

    try {
      const reviewDoc = {
        name: name,
        user_id: userId,
        date: date,
        text: review,
        movie_id: new ObjectId(movieId),
      };

      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  static async updateReview(reviewId, userId, review, date) {
    if (useMockData) {
      const reviewIndex = mockReviews.findIndex(
        (item) => item._id === reviewId && item.user_id === userId,
      );

      if (reviewIndex === -1) {
        return { modifiedCount: 0 };
      }

      mockReviews[reviewIndex] = {
        ...mockReviews[reviewIndex],
        text: review,
        date: date,
      };

      return { modifiedCount: 1 };
    }

    try {
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: new ObjectId(reviewId) },
        { $set: { text: review, date: date } },
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  static async deleteReview(reviewId, userId) {
    if (useMockData) {
      const reviewIndex = mockReviews.findIndex(
        (item) => item._id === reviewId && item.user_id === userId,
      );

      if (reviewIndex === -1) {
        return { deletedCount: 0 };
      }

      mockReviews.splice(reviewIndex, 1);

      return { deletedCount: 1 };
    }

    try {
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId),
        user_id: userId,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }
}
