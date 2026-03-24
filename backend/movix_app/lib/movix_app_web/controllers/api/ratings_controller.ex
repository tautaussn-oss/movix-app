defmodule MovixAppWeb.Api.RatingsController do
  use MovixAppWeb, :controller

  alias MovixApp.Ratings

  def create(conn, %{"id" => movie_id, "rating" => rating_value}) do
    attrs = %{
      "movie_id" => movie_id,
      "rating" => rating_value
    }

    case Ratings.create_rating(attrs) do
      {:ok, _rating} ->
        conn
        |> put_status(:created)
        |> json(%{ok: "proslo"})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset})
    end
  end
end
