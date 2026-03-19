defmodule MovixApp.Movies do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director
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

  def create_movie(attrs) do
    genres_names = Map.get(attrs, "genres", [])
    director_name = Map.get(attrs, "director")

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
