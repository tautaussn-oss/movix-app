defmodule MovixApp.MoviesHelper do
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director
  alias MovixApp.Repo
  import Ecto.Query

  def preload_all(query) do
    preload(query, [:genres, :director, :ratings])
  end

  defp get_director_by_full_name(full_name) do
    [name, surname] = String.split(full_name, " ")

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

  defp get_genres_by_names(names) do
    Repo.all(from(g in Genre, where: g.name in ^names))
  end

  def preprocess_genres_and_director(attrs) do
    genres_names =
      case Map.get(attrs, "genres") do
        nil -> []
        list when is_list(list) -> list
        single -> [single]
      end

    director_name = Map.get(attrs, "director")

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
