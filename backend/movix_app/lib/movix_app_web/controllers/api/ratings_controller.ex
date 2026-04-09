defmodule MovixAppWeb.Api.RatingsController do
  use MovixAppWeb, :controller

  alias MovixApp.Ratings

  def create(conn, %{"id" => movie_id, "rating" => rating_value}) do
    case Ratings.add_rating(movie_id, rating_value) do
      {:ok, msg} ->
        conn
        |> put_status(:created)
        |> json(%{ok: msg})

      {:error, msg} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: msg})
    end
  end
end
