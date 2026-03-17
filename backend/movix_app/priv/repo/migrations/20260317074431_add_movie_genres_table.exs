defmodule MovixApp.Repo.Migrations.AddMovieGenresTable do
  use Ecto.Migration

  def change do
    create table(:movie_genres, primary_key: false) do
      add(:movie_id, references(:movies, on_delete: :delete_all))
      add(:genre_id, references(:genres, on_delete: :delete_all))
    end

    create(index(:movie_genres, [:movie_id]))
    create(index(:movie_genres, [:genre_id]))
    create(unique_index(:movie_genres, [:movie_id, :genre_id]))
  end
end
