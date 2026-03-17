defmodule MovixApp.Repo.Migrations.AddGenresTable do
  use Ecto.Migration

  def change do
    create table(:genres) do
      add(:genre, :string)

      timestamps(type: :utc_datetime)
    end

    create(unique_index(:genres, :genre))
  end
end
