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
    with {:ok, %{url: poster_url, public_id: public_id}} <-
           upload_to_cloudinary(params["poster"]),
         attrs <-
           params
           |> Map.put("poster", poster_url)
           |> Map.put("public_id_cloudinary", public_id),
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

        # {:error, reason} ->
        #   conn
        #   |> put_status(:bad_request)
        #   |> json(%{error: inspect(reason)})
    end
  end

  def update(conn, %{"id" => id} = params) do
    movie = Movies.get_movie!(id)

    with {:ok, %{url: url, public_id: public_id}} <- handle_poster_update(movie, params),
         attrs <-
           params
           |> maybe_put("poster", url)
           |> maybe_put("public_id_cloudinary", public_id),
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

  defp maybe_put(map, _key, nil), do: map
  defp maybe_put(map, key, value), do: Map.put(map, key, value)

  defp upload_to_cloudinary(%Plug.Upload{path: path}) do
    case Cloudex.upload(path, %{folder: "movies"}) do
      {:ok, result} ->
        {:ok, %{url: result.secure_url, public_id: result.public_id}}

      {:error, err} ->
        {:error, err}
    end
  end

  defp upload_to_cloudinary(_), do: {:error, :no_file}

  defp handle_poster_update(movie, %{"poster" => %Plug.Upload{} = file}) do
    with {:ok, %{url: url, public_id: public_id}} <- upload_to_cloudinary(file),
         :ok <- delete_from_cloudinary(movie.public_id_cloudinary) do
      {:ok, %{url: url, public_id: public_id}}
    end
  end

  defp handle_poster_update(_movie, _params) do
    {:ok, %{url: nil, public_id: nil}}
  end

  def delete_from_cloudinary(nil), do: :ok

  def delete_from_cloudinary(public_id) do
    case Cloudex.delete(public_id) do
      {:ok, _} ->
        :ok

      {:error, reason} ->
        {:error, reason}
    end
  end
end
