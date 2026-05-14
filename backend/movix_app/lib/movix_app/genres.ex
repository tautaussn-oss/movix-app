defmodule MovixApp.Genres do
  alias MovixApp.Repo
  alias MovixApp.Genres.Genre

  import Ecto.Query

  @moduledoc """
  Context module for Genre logic, very simple for now
  """
  @doc """
  Retuns all Genres
  """
  def list_all do
    Repo.all(Genre)
  end

  @doc """
  Returns Genre with all the movies which have that genre
  """
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

  @doc """
  Funtion specifially for live view purposes
  Returns genre names as a list
  """
  def genre_names do
    query = from(g in Genre, order_by: :name, select: g.name)

    Repo.all(query)
  end
end
