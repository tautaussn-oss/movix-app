defmodule MovixApp.Ratings do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie

  import Ecto.Query

  @moduledoc """
  Context modules for rating logic, but only adding rating is needed for now
  """

  @doc """
  Takes id of movie whose rating will be updated and rating value
  Updates rating average, number of ratings for movie and sum of all ratings fields in database
  Returns success
  """
  def add_rating(movie_id, rating_value) do
    query =
      Movie
      |> where([m], m.id == ^movie_id)
      |> update([m],
        set: [
          rating_all: fragment("? + ?", m.rating_all, ^rating_value),
          rating_count: fragment("? + 1", m.rating_count),
          rating_avg:
            fragment(
              "(? + ?)::float / (? + 1)",
              m.rating_all,
              ^rating_value,
              m.rating_count
            )
        ]
      )

    case Repo.update_all(query, []) do
      {1, _} -> {:ok, :success}
      {0, _} -> {:error, :not_found}
    end
  end
end
