defmodule MovixAppWeb.Api.MoviesController do
  use MovixAppWeb, :controller

  alias MovixApp.Movies
  # alias MovixApp.Movies.Movie

  def index(conn, _params) do
    movies = Movies.list_all()
    render(conn, :index, movies: movies)
  end

  def show(conn, %{"id" => id}) do
    movie = Movies.get_movie!(id)
    render(conn, :show, movie: movie)
  end

  def create(conn, params) do
    with {:ok, poster_url} <- upload_to_cloudinary(params["poster"]),
         attrs <- Map.put(params, "poster", poster_url),
         {:ok, movie} <- Movies.create_movie(attrs) do
      movie = Movies.get_movie!(movie.id)

      conn
      |> put_status(:created)
      |> render(:show, movie: movie)
    else
      {:error, :director_not_found} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Director not found"})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset})

      {:error, reason} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: inspect(reason)})
    end
  end

  defp upload_to_cloudinary(slika) do
    try do
      case Cloudex.upload(slika, %{folder: "movies"}) do
        {:ok, result} -> {:ok, result.secure_url}
        {:error, err} -> {:error, err}
      end
    rescue
      e -> {:error, e}
    end
  end

  defp upload_to_cloudinary(_), do: {:error, :no_file}
end
