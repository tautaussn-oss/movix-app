defmodule MovixApp.Repo.Migrations.AddIndexesToTables do
  use Ecto.Migration

  def change do
    create(index(:movies, [:year]))
    create(index(:movies, [:rating_avg]))
    create(index(:movies, [:rating_count]))
    create(index(:movies, [:title]))
  end
end
