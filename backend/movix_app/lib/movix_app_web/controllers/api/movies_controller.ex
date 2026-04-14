defmodule MovixAppWeb.Api.MoviesController do
  use MovixAppWeb, :controller

  alias MovixApp.Movies
  alias MovixApp.CloudinaryHelper

  def index(conn, params) do
    movies = Movies.filter_movies(params)
    render(conn, :index, movies: movies)
  end

  def show(conn, %{"id" => id}) do
    case Movies.get_movie(id) do
      {:ok, movie} ->
        conn
        |> put_status(:ok)
        |> render(:show, movie: movie)

      {:error, err} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: err})
    end
  end

  def create(conn, params) do
    with {:ok, %{url: poster_url, public_id: public_id}} <-
           CloudinaryHelper.upload_to_cloudinary(params["poster"]),
         attrs <-
           params
           |> CloudinaryHelper.maybe_put("poster", poster_url)
           |> CloudinaryHelper.maybe_put("public_id_cloudinary", public_id),
         {:ok, movie} <- Movies.create_movie(attrs) do
      {:ok, movie} = Movies.get_movie(movie.id)

      conn
      |> put_status(:created)
      |> render(:show, movie: movie)
    else
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset})
    end
  end

  def update(conn, %{"id" => id} = params) do
    {:ok, movie} = Movies.get_movie(id)

    with {:ok, %{url: url, public_id: public_id}} <-
           CloudinaryHelper.handle_poster_update(movie, params),
         attrs <-
           params
           |> CloudinaryHelper.maybe_put("poster", url)
           |> CloudinaryHelper.maybe_put("public_id_cloudinary", public_id),
         {:ok, movie} <- Movies.update_movie(movie, attrs) do
      {:ok, movie} = Movies.get_movie(movie.id)

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
    {:ok, movie} = Movies.get_movie(id)

    case Movies.delete_movie(movie) do
      {:ok, _} ->
        send_resp(conn, :no_content, "")

      {:error, err} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: "Delete failed", reason: inspect(err)})
    end
  end

  def next(conn, %{"id" => id}) do
    case Movies.get_next_movie(id) do
      {:ok, movie} -> conn |> put_status(:ok) |> render(:show_id, movie: movie)
      {:error, err} -> conn |> put_status(:not_found) |> json(%{error: err})
    end
  end

  def prev(conn, %{"id" => id}) do
    case Movies.get_prev_movie(id) do
      {:ok, movie} -> conn |> put_status(:ok) |> render(:show_id, movie: movie)
      {:error, err} -> conn |> put_status(:not_found) |> json(%{error: err})
    end
  end

  def related_movies(conn, %{"id" => id}) do
    {:ok, related_movies} = Movies.get_related_movies(id)
    render(conn, :index, movies: related_movies)
  end

  def ping(conn, _params) do
    json(conn, %{ok: true})
  end
end
