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
      :public_id_cloudinary,
      :featured,
      :director_id,
      :rating_avg,
      :rating_all,
      :rating_count
    ])
    |> validate_required([
      :title,
      :description,
      :year,
      :duration,
      :poster,
      :public_id_cloudinary,
      :featured,
      :director_id
    ])
    |> assoc_constraint(:director)
  end
end
