defmodule MovixApp.Ratings.Rating do
  use Ecto.Schema
  import Ecto.Changeset
  alias MovixApp.Movies.Movie

  schema "ratings" do
    field(:rating, :integer)

    belongs_to(:movie, Movie)

    timestamps(type: :utc_datetime)
  end

  def changeset(rating, attrs) do
    rating
    |> cast(attrs, [:rating, :movie_id])
    |> validate_required([:rating, :movie_id])
    |> validate_number(:rating, greater_than: 0, less_than_or_equal_to: 10)
    |> assoc_constraint(:movie)
  end
end
