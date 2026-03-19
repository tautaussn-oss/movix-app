defmodule MovixAppWeb.Api.GenresController do
  use MovixAppWeb, :controller

  alias MovixApp.Genres

  def index(conn, _params) do
    genres = Genres.list_all()
    render(conn, :index, genres: genres)
  end

  def show(conn, %{"id" => id}) do
    genre = Genres.get_genre!(id)
    render(conn, :show, genre: genre)
  end
end
