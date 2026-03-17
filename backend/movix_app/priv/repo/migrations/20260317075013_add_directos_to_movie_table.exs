defmodule MovixApp.Repo.Migrations.AddDirectosToMovieTable do
  use Ecto.Migration

  def change do
    alter table(:movies) do
      add(:director_id, references(:directors))
      add(:poster, :string)
    end

    create(index(:movies, [:director_id]))
  end
end
