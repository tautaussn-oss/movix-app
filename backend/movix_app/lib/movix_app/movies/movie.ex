defmodule MovixApp.Movies.Movie do
  use Ecto.Schema
  import Ecto.Changeset
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director
  alias MovixApp.Ratings.Rating

  schema "movies" do
    field(:title, :string)
    field(:year, :integer)
    field(:description, :string)
    field(:duration, :integer)
    field(:poster, :string)
    field(:featured, :boolean)

    many_to_many(:genres, Genre, join_through: "movie_genres", on_replace: :delete)
    belongs_to(:director, Director)
    has_many(:ratings, Rating)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(movie, attrs) do
    movie
    |> cast(attrs, [
      :title,
      :description,
      :year,
      :duration,
      :poster,
      :featured,
      :director_id
    ])
    |> validate_required([
      :title,
      :description,
      :year,
      :duration,
      :poster,
      :featured,
      :director_id
    ])
    |> assoc_constraint(:director)
  end
end
