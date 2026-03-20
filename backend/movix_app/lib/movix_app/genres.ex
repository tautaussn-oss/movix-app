defmodule MovixApp.Genres do
  alias MovixApp.Repo
  alias MovixApp.Genres.Genre

  def list_all do
    Repo.all(Genre)
  end

  def get_genre!(id) do
    Repo.get!(Genre, id)
    |> Repo.preload(movies: [:ratings, :genres, :director])
  end
end
