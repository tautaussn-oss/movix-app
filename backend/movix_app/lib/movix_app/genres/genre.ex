defmodule MovixApp.Genres.Genre do
  use Ecto.Schema
  import Ecto.Changeset
  alias MovixApp.Movies.Movie

  schema "genres" do
    field(:genre, :string)

    many_to_many(:movies, Movie,
      join_through: "movie_genres",
      on_replace: :delete
    )

    timestamps(type: :utc_datetime)
  end

  def changeset(genre, attrs) do
    genre
    |> cast(attrs, [
      :genre
    ])
    |> validate_required([
      :genre
    ])
  end
end
