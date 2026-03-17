defmodule MovixApp.Repo.Migrations.AddDirectorsTable do
  use Ecto.Migration

  def change do
    create table(:directors) do
      add(:name, :string)
      add(:surname, :string)

      timestamps(type: :utc_datetime)
    end
  end
end
