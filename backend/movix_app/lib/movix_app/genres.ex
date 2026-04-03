defmodule MovixApp.Genres do
  alias MovixApp.Repo
  alias MovixApp.Genres.Genre

  import Ecto.Query

  def list_all do
    Repo.all(Genre)
  end

  def get_genre!(id) do
    Genre
    |> preload(movies: [:ratings, :genres, :director])
    |> Repo.get(id)
  end
end
