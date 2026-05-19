import mongodb from "mongodb";
import { mockMovies, mockReviews } from "../data/mockData.js";

const ObjectId = mongodb.ObjectId;
let movies;
let useMockData = false;

export default class MoviesDAO {
  static useMockData() {
    useMockData = true;
  }

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
    if (useMockData) {
      let filteredMovies = [...mockMovies];

      if (filters?.title) {
        const title = filters.title.toLowerCase();
        filteredMovies = filteredMovies.filter((movie) =>
          movie.title.toLowerCase().includes(title),
        );
      }

      if (filters?.rated) {
        filteredMovies = filteredMovies.filter((movie) => movie.rated === filters.rated);
      }

      const totalNumMovies = filteredMovies.length;
      const start = moviesPerPage * page;
      const moviesList = filteredMovies.slice(start, start + moviesPerPage);

      return { moviesList, totalNumMovies };
    }

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
    if (useMockData) {
      const movie = mockMovies.find((item) => item._id === id);

      if (!movie) {
        return null;
      }

      return {
        ...movie,
        reviews: mockReviews.filter((review) => review.movie_id === id),
      };
    }

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
    if (useMockData) {
      return [...new Set(mockMovies.map((movie) => movie.rated).filter(Boolean))];
    }

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
