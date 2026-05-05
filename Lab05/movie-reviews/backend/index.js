import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import MoviesDAO from "./dao/moviesDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();

const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 3000;

MongoClient.connect(process.env.MOVIEREVIEWS_DB_URI, {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
})
    .then(async (client) => {
        await MoviesDAO.injectDB(client);
        await ReviewsDAO.injectDB(client);

        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    });
