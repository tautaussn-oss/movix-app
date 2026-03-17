defmodule MovixApp.Repo.Migrations.AddFeaturedToMovies do
  use Ecto.Migration

  def change do
    alter table(:movies) do
      add(:featured, :boolean)
    end
  end
end
