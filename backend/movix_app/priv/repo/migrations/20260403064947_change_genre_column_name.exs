defmodule MovixApp.Repo.Migrations.ChangeGenreColumnName do
  use Ecto.Migration

  def change do
    rename table(:genres), :genre, to: :name
  end
end
