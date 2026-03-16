defmodule MovixAppWeb.Api.MoviesController do
  use MovixAppWeb, :controller

  alias MovixApp.Movies

  def index(conn, _params) do
    movies = Movies.list_all()
    render(conn, :index, movies: movies)
  end
end
