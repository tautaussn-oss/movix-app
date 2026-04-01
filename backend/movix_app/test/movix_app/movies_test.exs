defmodule MovixApp.MoviesTest do
  use MovixApp.DataCase

  import MovixApp.Fixtures
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director
  alias MovixApp.Movies.Movie
  alias MovixApp.Repo
  alias MovixApp.Movies

  describe "get_movie/1" do
    test "return success when movie is found" do
      movie = movie_fixture()

      {:ok, fetchedd_movie} = Movies.get_movie(movie.id)

      assert fetchedd_movie.id == movie.id
    end

    test "returns not_found error  when provided with wrong movie id" do
      movie = movie_fixture()
      assert {:error, :not_found} == Movies.get_movie("9999999")
    end

    test "return invalid_id error when provided with wrong id type" do
      movie = movie_fixture()
      assert {:error, :invalid_id} == Movies.get_movie("abc")
    end
  end

  describe "list directors/0" do
    test "list all directors from table directors with their full names" do
      director1 = director_fixture()
      director2 = director_fixture()

      directors = Movies.list_directors()

      assert length(directors) == 2
      assert Enum.any?(directors, fn d -> d.name == "Quentin" and d.surname == "Tarantino" end)
      refute Enum.any?(directors, fn d -> d.name == "Nikola" and d.surname == "Tausan" end)
    end
  end

  describe "filter_movies/1" do
    test "return movies filtered by featured flag = true" do
      # movie1 = movie_fixture(%{"featured" => true})
      # movie2 = movie_fixture()
      # movie3 = movie_fixture()
      # movie4 = movie_fixture()
      # movie5 = movie_fixture()
      # movie6 = movie_fixture()
      # movie7 = movie_fixture()
      # movie8 = movie_fixture()
      # movie9 = movie_fixture()
      # movie10 = movie_fixture()
      movies = movies_fixture(10)

      filter = %{"featured" => "true"}
      movie_filtered = Movies.filter_movies(filter)

      assert Enum.all?(movie_filtered, fn m -> m.featured == true end)
    end

    test "returns movies unchanged if filter not present" do
      movies = movies_fixture(10)
      filter = %{}
      movies_filtered = Movies.filter_movies(filter)

      assert movies == movies_filtered
    end

    test "return movies filtered by search parameter" do
      movies = movies_fixture(10)

      movies_filtered = Movies.filter_movies(%{"search" => "dja"})

      refute movies == movies_filtered
      assert Enum.all?(movies_filtered, fn m -> String.contains?(m.title, "dja") end)
    end
  end
end
