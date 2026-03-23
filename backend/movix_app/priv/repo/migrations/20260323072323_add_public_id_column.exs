defmodule MovixApp.Repo.Migrations.AddPublicIdColumn do
  use Ecto.Migration

  def change do
    alter table(:movies) do
      add(:public_id_cloudinary, :string)
    end
  end
end
