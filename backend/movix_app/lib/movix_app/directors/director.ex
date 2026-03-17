defmodule MovixApp.Directors.Director do
  use Ecto.Schema
  import Ecto.Changeset
  alias MovixApp.Movies.Movie

  schema "directors" do
    field(:name, :string)
    field(:surname, :string)

    has_many(:movies, Movie)

    timestamps(type: :utc_datetime)
  end

  def changeset(director, attrs) do
    director
    |> cast(attrs, [
      :name,
      :surname
    ])
    |> validate_required([
      :name,
      :surname
    ])
  end
end
