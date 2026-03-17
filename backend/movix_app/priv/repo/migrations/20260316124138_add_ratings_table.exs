defmodule MovixApp.Repo.Migrations.AddRatingsTable do
  use Ecto.Migration

  def change do
    create table(:ratings) do
      add(:rating, :integer)
      add(:movie_id, references(:movies, on_delete: :delete_all))

      timestamps(type: :utc_datetime)
    end

    create(index(:ratings, [:movie_id]))
  end
end
