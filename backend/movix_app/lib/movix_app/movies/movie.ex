defmodule MovixApp.Movies.Movie do
  use Ecto.Schema
  import Ecto.Changeset

  schema "movies" do
    field(:title, :string)
    field(:year, :integer)
    field(:description, :string)
    field(:duration, :integer)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(movie, attrs) do
    movie
    |> cast(attrs, [:title, :description, :year, :duration])
    |> validate_required([:title, :description, :year])
  end
end
