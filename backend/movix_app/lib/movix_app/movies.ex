defmodule MovixApp.Movies do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie

  def list_all do
    Repo.all(Movie)
    |> Repo.preload([:genres, :director, :ratings])
  end

  def get_movie!(id) do
    Repo.get!(Movie, id)
    |> Repo.preload([:genres, :director, :ratings])
  end
end

# import Ecto.Query

# query =
#   from m in Movie,
#     left_join: r in Rating, on: r.movie_id == m.id,
#     preload: [:genres],
#     group_by: m.id,
#     select: %{
#       id: m.id,
#       title: m.title,
#       year: m.year,
#       description: m.description,
#       genres: m.genres,
#       average_rating: avg(r.rating)
#     }

# movies = Repo.all(query)
