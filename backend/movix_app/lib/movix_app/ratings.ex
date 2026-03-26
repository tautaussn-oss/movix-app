defmodule MovixApp.Ratings do
  alias MovixApp.Repo
  # alias MovixApp.Ratings.Rating
  alias MovixApp.Movies.Movie

  import Ecto.Query

  # def create_rating(%{"movie_id" => movie_id, "rating" => rating_value}) do
  #   movie = Repo.get!(Movie, movie_id) |> Repo.preload([:genres, :director])

  #   rating_value = String.to_integer(rating_value)
  #   new_rating_count = movie.rating_count + 1
  #   new_rating_all = movie.rating_all + rating_value
  #   new_rating_avg = new_rating_all / new_rating_count

  #   movie
  #   |> Ecto.Changeset.change(%{
  #     rating_avg: new_rating_avg,
  #     rating_count: new_rating_count,
  #     rating_all: new_rating_all
  #   })
  #   |> Repo.update!()
  # end
  import Ecto.Query

  def add_rating(%{"movie_id" => movie_id, "rating" => rating_value}) do
    rating_value = String.to_integer(rating_value)

    Movie
    |> where([m], m.id == ^movie_id)
    |> update([m],
      set: [
        rating_all: fragment("? + ?", m.rating_all, ^rating_value),
        rating_count: fragment("? + 1", m.rating_count),
        rating_avg:
          fragment(
            "(? * ? + ?) / (? + 1)",
            m.rating_avg,
            m.rating_count,
            ^rating_value,
            m.rating_count
          )
      ]
    )
    |> Repo.update_all([])
  end
end
