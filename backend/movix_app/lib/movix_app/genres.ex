defmodule MovixApp.Genres do
  alias MovixApp.Repo
  alias MovixApp.Genres.Genre

  def list_all do
    Repo.all(Genre)
    |> Repo.preload(:movies)
  end

  def get_genre!(id) do
    Repo.get!(Genre, id)
    |> Repo.preload(:movies)
  end
end
