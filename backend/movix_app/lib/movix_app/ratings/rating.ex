defmodule MovixApp.Ratings.Rating do
  use Ecto.Schema
  import Ecto.Changeset
  alias MovixApp.Movies.Movie

  schema "ratings" do
    field(:rating, :float)

    belongs_to(:movie, Movie)

    timestamps(type: :utc_datetime)
  end

  def changeset(rating, attrs) do
    rating
    |> cast(attrs, [
      :rating
    ])
    |> validate_required([
      :rating
    ])
  end
end
