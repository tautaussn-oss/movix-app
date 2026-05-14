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
    field(:public_id_cloudinary, :string)
    field(:rating_avg, :float)
    field(:rating_all, :integer)
    field(:rating_count, :integer)

    many_to_many(:genres, Genre,
      join_through: "movie_genres",
      on_replace: :delete,
      on_delete: :delete_all
    )

    belongs_to(:director, Director)
    has_many(:ratings, Rating, on_delete: :delete_all)

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
      :director_id,
      :public_id_cloudinary
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
    |> validate_number(:rating_avg, greater_than_or_equal_to: 0, less_than_or_equal_to: 5)
    |> validate_number(:rating_count, greater_than_or_equal_to: 0)
    |> validate_number(:rating_all, greater_than_or_equal_to: 0)
    |> validate_length(:title, max: 255)
    |> validate_length(:description, min: 5, max: 1000)
    |> validate_number(:year,
      greater_than: 1900,
      less_than_or_equal_to: Date.utc_today().year + 1
    )
    |> validate_number(:duration, greater_than: 0, less_than: 400)
    |> assoc_constraint(:director)
  end
end
