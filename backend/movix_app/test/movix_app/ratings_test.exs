defmodule MovixApp.RatingsTest do
  use MovixApp.DataCase
  import MovixApp.Fixtures
  alias MovixApp.Ratings
  alias MovixApp.Movies.Movie
  alias MovixApp.Ratings.Rating
  alias MovixApp.Repo

  describe "assoc constraint" do
    test "fails when movie does not exist" do
      assert {:error, changeset} =
               %Rating{}
               |> Rating.changeset(%{rating: 5, movie_id: -1})
               |> Repo.insert()
    end
  end

  describe "add_rating/2" do
    test "returns error when movie does not exist" do
      assert {:error, :not_found} = Ratings.add_rating(-1, 5)
    end

    test "adds new rating for movie when rating is at default 0" do
      movie = movie_fixture()

      assert {:ok, :success} = Ratings.add_rating(movie.id, 5)
      Ratings.add_rating(movie.id, 5)
      Ratings.add_rating(movie.id, 2)

      movie_in_database = Repo.get!(Movie, movie.id)
      assert movie_in_database.rating_all == 12
      assert movie_in_database.rating_avg == 4.0
      assert movie_in_database.rating_count == 3
    end

    test "adds new rating for movie when some ratings already exist" do
      movie = movie_fixture(%{ratings: [6, 3, 7]})
      assert {:ok, :success} = Ratings.add_rating(movie.id, 9)

      movie_in_database = Repo.get!(Movie, movie.id)

      assert movie_in_database.rating_all == 25
      assert movie_in_database.rating_avg == 25 / 4
      assert movie_in_database.rating_count == 4
    end
  end
end
