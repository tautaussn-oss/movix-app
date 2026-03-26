defmodule MovixAppWeb.Api.MoviesController do
  use MovixAppWeb, :controller

  alias MovixApp.Movies
  # alias MovixApp.Movies.Movie
  alias MovixAppWeb.Api.CloudinaryHelper

  def index(conn, params) do
    IO.inspect(params, label: "PARAMS")
    movies = Movies.filter_movies(params)
    render(conn, :index, movies: movies)
  end

  def show(conn, %{"id" => id}) do
    movie = Movies.get_movie!(id)
    render(conn, :show, movie: movie)
  end

  def create(conn, params) do
    with {:ok, %{url: poster_url, public_id: public_id}} <-
           CloudinaryHelper.upload_to_cloudinary(params["poster"]),
         attrs <-
           params
           |> CloudinaryHelper.maybe_put("poster", poster_url)
           |> CloudinaryHelper.maybe_put("public_id_cloudinary", public_id),
         {:ok, movie} <- Movies.create_movie(attrs) do
      movie = Movies.get_movie!(movie.id)

      conn
      |> put_status(:created)
      |> render(:show, movie: movie)
    else
      # {:error, :director_not_found} ->
      #   conn
      #   |> put_status(:bad_request)
      #   |> json(%{error: "Director not found"})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset})

        # {:error, reason} ->
        #   conn
        #   |> put_status(:bad_request)
        #   |> json(%{error: inspect(reason)})
    end
  end

  def update(conn, %{"id" => id} = params) do
    movie = Movies.get_movie!(id)

    with {:ok, %{url: url, public_id: public_id}} <-
           CloudinaryHelper.handle_poster_update(movie, params),
         attrs <-
           params
           |> CloudinaryHelper.maybe_put("poster", url)
           |> CloudinaryHelper.maybe_put("public_id_cloudinary", public_id),
         {:ok, movie} <- Movies.update_movie(movie, attrs) do
      movie = Movies.get_movie!(movie.id)

      conn
      |> put_status(:ok)
      |> render(:show, movie: movie)
    else
      {:error, err} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: err})
    end
  end

  def delete(conn, %{"id" => id}) do
    movie = Movies.get_movie!(id)

    case Movies.delete_movie(movie) do
      {:ok, _} ->
        send_resp(conn, :no_content, "")

      {:error, err} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: "Delete failed", reason: inspect(err)})
    end
  end
end
