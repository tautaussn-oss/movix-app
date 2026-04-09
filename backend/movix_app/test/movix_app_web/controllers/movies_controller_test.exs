defmodule MovixAppWeb.MoviesControllerTest do
  use MovixAppWeb.ConnCase
  import MovixApp.Fixtures
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director
  alias MovixApp.Movies.Movie
  alias MovixApp.Repo

  describe "GET /movies" do
    test "returns movies", %{conn: conn} do
      movie = movie_fixture()

      conn = get(conn, "/api/movies")

      assert %{"movies" => movies} = json_response(conn, 200)
      assert Enum.any?(movies, &(&1["id"] == movie.id))
    end
  end

  test "returns 404 for missing movie", %{conn: conn} do
    conn = get(conn, "/api/movies/999999")
    assert response(conn, 404)
  end

  test "returns empty list when no movies exist", %{conn: conn} do
    conn = get(conn, "/api/movies")

    assert %{"movies" => []} = json_response(conn, 200)
  end
  
  test "" do
    
  end

  # test "search with empty string returns all movies", %{conn: conn} do
  #   _m1 = create_movie(%{title: "Batman"})
  #   _m2 = create_movie(%{title: "Superman"})

  #   conn = get(conn, "/api/movies?search=")

  #   %{"movies" => movies} = json_response(conn, 200)

  #   assert length(movies) >= 2
  # end

  # test "search with no matches returns empty list", %{conn: conn} do
  #   _m = create_movie(%{title: "Batman"})

  #   conn = get(conn, "/api/movies?search=xyz123")

  #   assert %{"movies" => []} = json_response(conn, 200)
  # end

  # test "search is case insensitive", %{conn: conn} do
  #   _m = create_movie(%{title: "Batman"})

  #   conn = get(conn, "/api/movies?search=BAT")

  #   %{"movies" => [movie]} = json_response(conn, 200)

  #   assert movie["title"] == "Batman"
  # end

  # test "genre that does not exist returns empty list", %{conn: conn} do
  #   _m = create_movie()

  #   conn = get(conn, "/api/movies?genre[]=NonExisting")

  #   assert %{"movies" => []} = json_response(conn, 200)
  # end

  # test "does not return movie if only one of multiple genres matches", %{conn: conn} do
  #   g1 = Repo.insert!(%Genre{name: "Action"})
  #   _g2 = Repo.insert!(%Genre{name: "Drama"})

  #   director = Repo.insert!(%Director{name: "A", surname: "B"})

  #   movie =
  #     %Movie{
  #       title: "Only Action",
  #       year: 2000,
  #       description: "desc",
  #       duration: 120,
  #       poster: "url",
  #       public_id_cloudinary: "pid",
  #       director_id: director.id
  #     }
  #     |> Repo.insert!()

  #   movie
  #   |> Repo.preload(:genres)
  #   |> Ecto.Changeset.change()
  #   |> Ecto.Changeset.put_assoc(:genres, [g1])
  #   |> Repo.update!()

  #   conn =
  #     get(conn, "/api/movies?genre[]=Action&genre[]=Drama")

  #   assert %{"movies" => []} = json_response(conn, 200)
  # end

  # test "duplicate genres do not break query", %{conn: conn} do
  #   _m = create_movie()

  #   conn =
  #     get(conn, "/api/movies?genre[]=Action&genre[]=Action")

  #   # should not crash
  #   assert %{"movies" => _} = json_response(conn, 200)
  # end

  # test "invalid featured value is ignored", %{conn: conn} do
  #   _m1 = create_movie(%{featured: true})
  #   _m2 = create_movie(%{featured: false})

  #   conn = get(conn, "/api/movies?featured=not_boolean")

  #   %{"movies" => movies} = json_response(conn, 200)

  #   # should return all (filter ignored)
  #   assert length(movies) >= 2
  # end

  # test "invalid sort falls back to default", %{conn: conn} do
  #   _m1 = create_movie()
  #   _m2 = create_movie()

  #   conn = get(conn, "/api/movies?sort_by=invalid")

  #   %{"movies" => movies} = json_response(conn, 200)

  #   # default sort is :id ascending
  #   ids = Enum.map(movies, & &1["id"])

  #   assert ids == Enum.sort(ids)
  # end

  # test "sorting on empty DB returns empty list", %{conn: conn} do
  #   conn = get(conn, "/api/movies?sort_by=rating")

  #   assert %{"movies" => []} = json_response(conn, 200)
  # end

  # test "next returns nil if last movie", %{conn: conn} do
  #   m = create_movie()

  #   conn = get(conn, "/api/movies/#{m.id}/next")

  #   assert json_response(conn, 200) == nil
  # end

  # test "next skips deleted ids correctly", %{conn: conn} do
  #   m1 = create_movie()
  #   m2 = create_movie()
  #   m3 = create_movie()

  #   Repo.delete!(Repo.get!(Movie, m2.id))

  #   conn = get(conn, "/api/movies/#{m1.id}/next")

  #   response = json_response(conn, 200)

  #   assert response["id"] == m3.id
  # end

  # test "id does exist", %{conn: conn} do
  #   conn = get(conn, "/api/movies")

  #   assert json_response(conn, 200)
  # end
end
