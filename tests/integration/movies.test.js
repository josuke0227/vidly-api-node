const { Movie } = require("../../models/movie");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const request = require("supertest");

describe("/api/movies", () => {
  describe("POST /", () => {
    let server;
    let movieId;
    let token;
    let movie;

    const exec = async () => {
      return request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send(movie);
    };

    beforeEach(async () => {
      server = require("../../index");

      genreId = mongoose.Types.ObjectId();
      movieId = mongoose.Types.ObjectId();
      token = new User().generateAuthToken();

      movie = new Movie({
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
        genre: { id: genreId, name: "12345" },
        numberInStock: 10,
      });
    });

    afterEach(async () => {
      await server.close();
      await Movie.deleteMany({});
    });

    it("should return 400 if title of the movie is empty", async () => {
      movie.title = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title of the movie is less than 5 characters", async () => {
      movie.title = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if title of the movie is less than 50 characters", async () => {
      movie.title = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre id is not given", async () => {
      movie.genre = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if number of stock is not given", async () => {
      movie.numberInStock = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if number of stock is 0", async () => {
      movie.numberInStock = 0;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if number of dailyRentalRate is not given", async () => {
      movie.dailyRentalRate = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if dailyRentalRate is 0", async () => {
      movie.dailyRentalRate = 0;

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
