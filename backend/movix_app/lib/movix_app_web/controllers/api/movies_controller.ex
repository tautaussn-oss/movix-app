defmodule MovixAppWeb.Api.MoviesController do
  use MovixAppWeb, :controller

  alias MovixApp.Movies
  # alias MovixApp.Movies.Movie

  def index(conn, _params) do
    movies = Movies.list_all()
    render(conn, :index, movies: movies)
  end

  def show(conn, %{"id" => id}) do
    movie = Movies.get_movie!(id)
    render(conn, :show, movie: movie)
  end
end
