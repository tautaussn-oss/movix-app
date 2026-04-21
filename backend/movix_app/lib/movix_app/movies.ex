defmodule MovixApp.Movies do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie
  alias MovixApp.CloudinaryHelper
  alias MovixApp.MoviesHelper

  import Ecto.Query

  @moduledoc """
    Main context module
    This module implements variuos functions with Movie struct
    such as creating a movie or deleting one, updating, getting previous movie etc.

  """

  @doc """
  Returns success, Movie struct
  Takes id of the movie as an argument
  """
  def get_movie(id) do
    try do
      movie = Movie |> preload([:genres, :director])

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

  @doc """
  Returns all Movie structs from database
  """
  def list_all, do: filter_movies(%{})

  @doc """
    Returns all movies that pass one or more filters
  Filters are :
  featured which is boolean value
  list of genres
  search string which then filters movies based on title
  sort_by title, year, average rating
  sort_by popular - returns 6 most "popular" movies
  """
  def filter_movies(%{"sort_by" => "popular"}) do
    Movie
    |> order_by([m], desc: m.rating_count)
    |> limit(6)
    |> preload([:genres, :director])
    |> Repo.all()
  end

  def filter_movies(filter) do
    Movie
    |> filter_featured(filter["featured"])
    |> filter_by_genres(filter)
    |> filter_search(filter["search"])
    |> sort(filter["sort_by"])
    |> preload([:genres, :director])
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

  @doc """
  Inserts a Movie into the database and returns success, Movie struct
  Arguments are attributes Movie fields which will be inserted
  Returns success, Movie struct
  """
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

  @doc """
  Updates movie in database
  Arguments are Movie struct which is being updated
  and attributes which are fields which will be updated
  Returns success, Movie struct
  """
  def update_movie(movie, attrs) do
    with {:ok, attrs, genres} <- MoviesHelper.preprocess_genres_and_director(attrs) do
      movie
      |> Movie.changeset(attrs)
      |> Ecto.Changeset.put_assoc(:genres, genres)
      |> Repo.update()
    end
  end

  @doc """
  Deletes movie from database
  Returns success, Movie struct
  """
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

  @doc """
  Returns next movie, basically movie whose id is id+1
  Returns error, when argument is last id
  """
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

  @doc """
  Returns next movie, basically movie whose id is id-1
  Returns error, when argument is first id
  """
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

  @doc """
  Returns all movies which are related with movie whose id is given as an argument, excluding itself
  Related movies are ones that have genres in common
  Movies which have the most genres in common will be listed first in desc order
  """
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
          genre_ids = Enum.map(movie.genres, fn g -> g.id end)

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
    rescue
      _e in Ecto.Query.CastError -> {:error, :invalid_id}
    end
  end
end
