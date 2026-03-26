defmodule MovixApp.Repo.Migrations.NewAvgRatingLogic do
  use Ecto.Migration

  def change do
    alter table(:movies) do
      add(:rating_all, :integer, default: 0, null: false)
      add(:rating_count, :integer, default: 0, null: false)
      add(:rating_avg, :float, default: 0.0, null: false)
    end
  end
end
