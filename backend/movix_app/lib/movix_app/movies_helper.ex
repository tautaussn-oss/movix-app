defmodule MovixApp.MoviesHelper do
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director
  alias MovixApp.Repo
  import Ecto.Query

  @moduledoc """
  Helper module for movie, it is used as a preproccessing for movie functions
  So from frontend I get full name of Director as string and genres as list of strings of genre names
  And in this module that values are transformed and added to attributes which are used by movie functions
  """

  @doc """
  Function takes full name of Director and it adds him into Director table in database if its new Director and returns his director_id
  Or it returns director_id of existing director
  Directors are unique in database, and if director's consists of more than 2 words
  Name will be one word and all other go into surname field
  """
  def get_director_by_full_name(full_name) when full_name in ["", nil] do
    {:error, :empty_name}
  end

  def get_director_by_full_name(full_name) do
    [name | surname_parts] = String.split(full_name, " ", trim: true)
    surname = Enum.join(surname_parts, " ")

    case Repo.get_by(Director, name: name, surname: surname) do
      nil ->
        director =
          %Director{}
          |> Director.changeset(%{name: name, surname: surname})

        case Repo.insert(director) do
          {:ok, director} -> {:ok, director}
          {:error, changeset} -> {:error, changeset}
        end

      director ->
        {:ok, director}
    end
  end

  @doc """
  Takes list of genre names as argument and all genres which are in that list of genre names
  """
  def get_genres_by_names(names) do
    Repo.all(from(g in Genre, where: g.name in ^names))
  end

  @doc """
    Prepares attributes for movie functions, adds director_id to attributes and genres as separate attribute
  """
  def preprocess_genres_and_director(attrs) do
    genres_names =
      case Map.get(attrs, "genres") do
        nil -> []
        list when is_list(list) -> list
        single -> [single]
      end

    director_name = Map.get(attrs, "director")

    do_preprocess(director_name, genres_names, attrs)
  end

  defp do_preprocess("", genres_names, attrs) do
    genres = get_genres_by_names(genres_names)

    attrs = attrs |> Map.drop(["director", "genres"])

    {:ok, attrs, genres}
  end

  defp do_preprocess(director_name, genres_names, attrs) do
    with {:ok, director} <- get_director_by_full_name(director_name) do
      genres = get_genres_by_names(genres_names)

      attrs =
        attrs
        |> Map.put("director_id", director.id)
        |> Map.drop(["director", "genres"])

      {:ok, attrs, genres}
    end
  end
end
