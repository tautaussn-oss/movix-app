defmodule MovixApp.Movies do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie
  alias MovixApp.CloudinaryHelper
  alias MovixApp.MoviesHelper

  import Ecto.Query

  def get_movie(id) do
    try do
      movie = Movie |> preload([:genres, :director, :ratings])

      case Repo.get(movie, id) do
        nil ->
          {:error, :not_found}

        movie ->
          {:ok, movie}
      end
    rescue
      _e in Ecto.Query.CastError -> {:error, :invalid_id}
    end
  end

  def list_all, do: filter_movies(%{})

  def filter_movies(%{"sort_by" => "popular"}) do
    Movie
    |> order_by([m], desc: m.rating_count)
    |> limit(6)
    |> preload([:genres, :director, :ratings])
    |> Repo.all()
  end

  def filter_movies(filter) do
    Movie
    |> filter_featured(filter["featured"])
    |> filter_by_genres(filter)
    |> filter_search(filter["search"])
    |> sort(filter["sort_by"])
    |> preload([:genres, :director, :ratings])
    |> Repo.all()
  end

  defp filter_by_genres(query, %{"genre" => genres}) do
    genres = List.wrap(genres)

    from(movie in query,
      join: g in assoc(movie, :genres),
      where: g.name in ^genres,
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
    end
  end

  def update_movie(movie, attrs) do
    with {:ok, attrs, genres} <- MoviesHelper.preprocess_genres_and_director(attrs) do
      movie
      |> Movie.changeset(attrs)
      |> Ecto.Changeset.put_assoc(:genres, genres)
      |> Repo.update()
    end
  end

  def delete_movie(%Movie{} = movie) do
    try do
      with {:ok, movie} <- Repo.delete(movie) do
        CloudinaryHelper.delete_from_cloudinary(movie.public_id_cloudinary)
        {:ok, movie}
      end
    rescue
      _ ->
        {:error, "Failed to delete movie"}
    end
  end

  def get_next_movie(id) do
    try do
      case Repo.one(
             from(m in Movie,
               where: m.id > ^id,
               order_by: [asc: m.id],
               limit: 1
             )
           ) do
        nil -> {:error, :not_found}
        movie -> {:ok, movie}
      end
    rescue
      _e in Ecto.Query.CastError -> {:error, :invalid_id}
    end
  end

  def get_prev_movie(id) do
    try do
      case Repo.one(
             from(m in Movie,
               where: m.id < ^id,
               order_by: [desc: m.id],
               limit: 1
             )
           ) do
        nil -> {:error, :not_found}
        movie -> {:ok, movie}
      end
    rescue
      _e in Ecto.Query.CastError -> {:error, :invalid_id}
    end
  end

  def get_related_movies(id) do
    case get_movie(id) do
      {:error, :invalid_id} ->
        {:error, :invalid_id}

      {:error, :not_found} ->
        {:error, :not_found}

      {:ok, movie} ->
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
          |> preload(:director)
          |> Repo.all()

        {:ok, related}
    end
  end
end
