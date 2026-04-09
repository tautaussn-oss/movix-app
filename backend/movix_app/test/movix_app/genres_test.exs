defmodule MovixApp.GenresTest do
  use MovixApp.DataCase

  import MovixApp.Fixtures
  alias MovixApp.Genres
  alias MovixApp.Genres.Genre

  describe "unique constraint" do
    test "no possible to insert duplicates" do
      Repo.insert!(%Genre{name: "Acton"})

      assert {:error, changeset} =
               Genre
               |> Genre.changeset(%{name: "Action"})
               |> Repo.insert()
    end
  end

  describe "list_all/0" do
    test "returns all genres" do
      genre_fixture("Comedy")
      genre_fixture("Horror")
      genre_fixture("Thriller")

      all_genres = Genres.list_all()
      names = Enum.map(all_genres, fn g -> g.name end)

      assert length(all_genres) == 3
      assert names == ["Comedy", "Horror", "Thriller"]
    end
  end

  describe "get_genre/1" do
    test "returns success when movie is found" do
      genre = genre_fixture()

      assert {:ok, fetched_genre} = Genres.get_genre(genre.id)
      assert fetched_genre.id == genre.id
    end

    test "returns error when id is not found" do
      genre_fixture()
      assert {:error, :not_found} == Genres.get_genre(99999)
    end

    test "returns error when id is invalid" do
      genre_fixture()
      assert {:error, :invalid_id} == Genres.get_genre("abc")
    end
  end
end
