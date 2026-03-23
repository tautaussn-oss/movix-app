defmodule MovixApp.Movies do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director
  alias MovixAppWeb.Api.MoviesController

  import Ecto.Query

  def list_all do
    Repo.all(Movie)
    |> Repo.preload([:genres, :director, :ratings])
  end

  def get_movie!(id) do
    Repo.get!(Movie, id)
    |> Repo.preload([:genres, :director, :ratings])
  end

  def get_director_by_full_name(full_name) do
    [name, surname] = String.split(full_name, " ")

    case Repo.get_by(Director, name: name, surname: surname) do
      nil -> {:error, :director_not_found}
      director -> {:ok, director}
    end
  end

  def get_genres_by_names(names) do
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

  def create_movie(attrs) do
    genres_names =
      case Map.get(attrs, "genres") do
        nil -> []
        list when is_list(list) -> list
        single -> [single]
      end

    director_name = Map.get(attrs, "director")

    # attrs =
    #   attrs
    #   |> normalize_attrs()

    with {:ok, director} <- get_director_by_full_name(director_name),
         genres <- get_genres_by_names(genres_names) do
      attrs =
        attrs
        |> Map.put("director_id", director.id)
        |> Map.drop(["director", "genres"])

      %Movie{}
      |> Movie.changeset(attrs)
      |> Ecto.Changeset.put_assoc(:genres, genres)
      |> Repo.insert()
    end
  end

  def update_movie(movie, attrs) do
    movie
    |> Movie.changeset(attrs)
    |> Repo.update()
  end

  def delete_movie(%Movie{} = movie) do
    Repo.transaction(fn ->
      case MoviesController.delete_from_cloudinary(movie.public_id_cloudinary) do
        :ok -> :ok
        {:error, err} -> Repo.rollback(err)
      end

      Repo.delete(movie)
    end)
  end
end

# import Ecto.Query

# query =
#   from m in Movie,
#     left_join: r in Rating, on: r.movie_id == m.id,
#     preload: [:genres],
#     group_by: m.id,
#     select: %{
#       id: m.id,
#       title: m.title,
#       year: m.year,
#       description: m.description,
#       genres: m.genres,
#       average_rating: avg(r.rating)
#     }

# movies = Repo.all(query)
