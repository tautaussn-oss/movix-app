defmodule MovixApp.Genres do
  alias MovixApp.Repo
  alias MovixApp.Genres.Genre

  import Ecto.Query

  def list_all do
    Repo.all(Genre)
  end

  def get_genre(id) do
    try do
      genre = Genre |> preload(movies: [:ratings, :genres, :director])

      case Repo.get(genre, id) do
        nil ->
          {:error, :not_found}

        genre ->
          {:ok, genre}
      end
    rescue
      _e in Ecto.Query.CastError -> {:error, :invalid_id}
    end
  end
end
