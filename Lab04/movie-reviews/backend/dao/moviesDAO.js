import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;
let movies;

export default class MoviesDAO {
  static async injectDB(conn) {
    if (movies) {
      return;
    }

    try {
      movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection("movies");
    } catch (e) {
      console.error(`Unable to establish collection handles in MoviesDAO: ${e}`);
    }
  }

  static async getMovies({
    filters = null,
    page = 0,
    moviesPerPage = 20,
  } = {}) {
    let query = {};

    if (filters) {
      if (filters.title) {
        query.title = { $regex: filters.title, $options: "i" };
      }

      if (filters.rated) {
        query.rated = { $eq: filters.rated };
      }
    }

    if (Object.keys(query).length === 0) {
      query = {};
    }

    let cursor;

    try {
      cursor = await movies
        .find(query)
        .limit(moviesPerPage)
        .skip(moviesPerPage * page);

      const moviesList = await cursor.toArray();
      const totalNumMovies = await movies.countDocuments(query);

      return { moviesList, totalNumMovies };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { moviesList: [], totalNumMovies: 0 };
    }
  }

  static async getMovieById(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "movie_id",
            as: "reviews",
          },
        },
      ];
      return await movies.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getMovieById: ${e}`);
      throw e;
    }
  }

  static async getRatings() {
    let ratings = [];
    try {
      ratings = await movies.distinct("rated");
      return ratings;
    } catch (e) {
      console.error(`Unable to get ratings, ${e}`);
      return ratings;
    }
  }
}
