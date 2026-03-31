defmodule MovixApp.MoviesTest do
  use MovixApp.DataCase

  import MovixApp.Fixtures
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director
  alias MovixApp.Movies.Movie
  alias MovixApp.Repo
  alias MovixApp.Movies

  describe "get_movie!/1" do
    test "return success when movie is found" do
      movie = movie_fixture()

      {:ok, fetchedd_movie} = Movies.get_movie(movie.id)

      assert fetchedd_movie.id == movie.id
    end
  end

  test "returns error when provided with wrong movie id" do
    movie = movie_fixture()
    assert {:error, :not_found} == Movies.get_movie("abc")
  end
end
