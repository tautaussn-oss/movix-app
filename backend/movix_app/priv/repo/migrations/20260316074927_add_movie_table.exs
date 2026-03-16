defmodule MovixApp.Repo.Migrations.AddMovieTable do
  use Ecto.Migration

  def change do
    create table(:movies) do
      add(:title, :string)
      add(:description, :string)
      add(:year, :integer)
      add(:duration, :integer)

      timestamps(type: :utc_datetime)
    end
  end
end
