defmodule MovixApp.Repo.Migrations.ChangeMovieDescriptionToText do
  use Ecto.Migration

  def change do
    alter table(:movies) do
      modify(:description, :text)
    end
  end
end
