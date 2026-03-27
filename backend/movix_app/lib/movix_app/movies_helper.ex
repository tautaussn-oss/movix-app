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
      nil -> {:error, :director_not_found}
      director -> {:ok, director}
    end
  end

  defp get_genres_by_names(names) do
    Repo.all(from(g in Genre, where: g.genre in ^names))
  end

  # defp normalize_attrs(attrs) do
  #   attrs
  #   |> Map.update("year", nil, &parse_int/1)
  #   |> Map.update("duration", nil, &parse_int/1)
  #   |> Map.update("featured", false, &parse_bool/1)
  # end

  # defp parse_int(nil), do: nil
  # defp parse_int(val) when is_integer(val), do: val

  # defp parse_int(val) when is_binary(val) do
  #   case Integer.parse(val) do
  #     {int, _} -> int
  #     :error -> nil
  #   end
  # end

  # defp parse_bool(val) when val in [true, "true", "1", 1, "on"], do: true
  # defp parse_bool(_), do: false

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
