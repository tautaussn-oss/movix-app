defmodule MovixAppWeb.Api.RatingsController do
  use MovixAppWeb, :controller

  alias MovixApp.Ratings

  def create(conn, %{"id" => movie_id, "rating" => rating_value}) do
    attrs = %{
      "movie_id" => movie_id,
      "rating" => rating_value
    }

    case Ratings.add_rating(attrs) do
      {1, _} ->
        conn
        |> put_status(:created)
        |> json(%{ok: "proslo"})

      {0, _} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Movie not found"})
    end
  end
end
