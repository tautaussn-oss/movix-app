defmodule MovixApp.Movies do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie
  # alias MovixApp.Genres.Genre
  # alias MovixApp.Directors.Director
  # alias MovixAppWeb.Api.MoviesController
  alias MovixAppWeb.Api.CloudinaryHelper
  alias MovixApp.MoviesHelper

  import Ecto.Query

  def list_all() do
    Movie
    |> Repo.all()
    |> Repo.preload([:genres, :director, :ratings])
  end

  def get_movie!(id) do
    Repo.get!(Movie, id)
    |> Repo.preload([:genres, :director, :ratings])
  end

  def filter_movies(filter) do
    Movie
    |> filter_featured(filter["featured"])
    |> filter_by_genres(filter)
    |> filter_search(filter["search"])
    |> sort(filter["sort_by"])
    |> Repo.all()
    |> Repo.preload([:genres, :director, :ratings])
  end

  defp filter_by_genres(query, %{"genre" => genres}) do
    from(movie in query,
      join: g in assoc(movie, :genres),
      where: g.genre in ^genres,
      preload: [:genres]
    )
  end

  defp filter_by_genres(query, _), do: query

  defp filter_search(query, s) when s in ["", nil], do: query

  defp filter_search(query, s) do
    where(query, [movie], ilike(movie.title, ^"%#{s}%"))
  end

  defp sort(query, "title") do
    order_by(query, :title)
  end

  defp sort(query, "year") do
    order_by(query, :year)
  end

  defp sort(query, "rating") do
    order_by(query, :rating_avg)
  end

  defp sort(query, _) do
    order_by(query, :id)
  end

  defp filter_featured(query, "true") do
    from(movie in query, where: movie.featured == true)
  end

  defp filter_featured(query, _), do: query

  def create_movie(attrs) do
    with {:ok, attrs, genres} <- MoviesHelper.preprocess_genres_and_director(attrs) do
      %Movie{}
      |> Movie.changeset(attrs)
      |> Ecto.Changeset.put_assoc(:genres, genres)
      |> Repo.insert()
    end
  end

  def update_movie(movie, attrs) do
    with {:ok, attrs, genres} <- MoviesHelper.preprocess_genres_and_director(attrs) do
      movie
      |> Movie.changeset(attrs)
      |> Ecto.Changeset.put_assoc(:genres, genres)
      |> Repo.update()
    else
      {:error, reason} -> {:error, reason}
    end
  end

  def delete_movie(%Movie{} = movie) do
    Repo.transaction(fn ->
      case CloudinaryHelper.delete_from_cloudinary(movie.public_id_cloudinary) do
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
