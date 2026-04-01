defmodule MovixApp.Movies do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie
  # alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director
  # alias MovixAppWeb.Api.MoviesController
  alias MovixAppWeb.Api.CloudinaryHelper
  alias MovixApp.MoviesHelper

  import Ecto.Query

  def list_directors() do
    Repo.all(Director)
  end

  def get_movie(id) do
    try do
      case Repo.get(Movie, id) do
        nil ->
          {:error, :not_found}

        movie ->
          movie = Repo.preload(movie, [:genres, :director, :ratings])
          {:ok, movie}
      end
    rescue
      _e in Ecto.Query.CastError -> {:error, :invalid_id}
    end
  end

  def filter_movies(filter) do
    Movie
    |> filter_featured(filter["featured"])
    |> filter_by_genres(filter)
    |> filter_search(filter["search"])
    |> filter_popular(filter["popular"])
    |> sort(filter["sort_by"])
    |> Repo.all()
    |> Repo.preload([:genres, :director, :ratings])
  end

  defp filter_by_genres(query, %{"genre" => genres}) do
    genres = List.wrap(genres)

    from(movie in query,
      join: g in assoc(movie, :genres),
      where: g.genre in ^genres,
      group_by: movie.id,
      having: count(g.id) == ^length(genres),
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
    order_by(query, [m], desc: m.year)
  end

  defp sort(query, "rating") do
    order_by(query, [m], desc: m.rating_avg)
  end

  defp sort(query, _) do
    order_by(query, :id)
  end

  defp filter_popular(query, "true") do
    query
    |> order_by([m], desc: m.rating_count)
    |> limit(6)
  end

  defp filter_popular(query, _), do: query

  defp filter_featured(query, "true") do
    from(movie in query, where: movie.featured == true)
  end

  defp filter_featured(query, _), do: query

  def create_movie(attrs) do
    with {:ok, attrs, genres} <- MoviesHelper.preprocess_genres_and_director(attrs),
         {:ok, movie} <-
           %Movie{}
           |> Movie.changeset(attrs)
           |> Ecto.Changeset.put_assoc(:genres, genres)
           |> Repo.insert() do
      {:ok, movie}
    else
      {:error, reason} ->
        {:error, reason}
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

  def get_next_movie(id) do
    # movie =
    try do
      case Repo.one(
             from(m in Movie,
               where: m.id > ^id,
               order_by: [asc: m.id],
               limit: 1
             )
           ) do
        nil -> nil
        movie -> {:ok, movie}
      end
    rescue
      _e in Ecto.Query.CastError -> {:error, :invalid_id}
    end

    # ||
    #   Repo.one(
    #     from(m in Movie,
    #       order_by: [asc: m.id],
    #       limit: 1
    #     )
    #   )
  end

  def get_prev_movie(id) do
    # movie =
    try do
      case Repo.one(
             from(m in Movie,
               where: m.id < ^id,
               order_by: [desc: m.id],
               limit: 1
             )
           ) do
        nil -> nil
        movie -> {:ok, movie}
      end
    rescue
      _e in Ecto.Query.CastError -> {:error, :invalid_id}
    end

    #  ||
    #   Repo.one(
    #     from(m in Movie,
    #       order_by: [desc: m.id],
    #       limit: 1
    #     )
    #   )
  end

  def get_related_movies(id) do
    try do
      movie =
        Movie
        |> Repo.get(id)
        |> Repo.preload(:genres)

      case movie do
        nil ->
          {:error, :not_found}

        movie ->
          genre_ids = Enum.map(movie.genres, fn genre -> genre.id end)

          related =
            from(m in Movie,
              join: g in assoc(m, :genres),
              where: g.id in ^genre_ids and m.id != ^movie.id,
              group_by: m.id,
              order_by: [desc: count(g.id)],
              limit: 6,
              preload: [:genres]
            )
            |> Repo.all()
            |> Repo.preload(:director)

          {:ok, related}
      end
    rescue
      _e in Ecto.Query.CastError -> {:error, :invalid_id}
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
