defmodule MovixAppWeb.MoviesControllerTest do
  use MovixAppWeb.ConnCase
  import MovixApp.Fixtures
  # doctest MovixAppWeb.Api.MoviesController

  describe "GET /movies" do
    test "returns movies", %{conn: conn} do
      movie = movie_fixture()

      conn = get(conn, "/api/movies")

      assert %{"movies" => movies} = json_response(conn, 200)
      assert Enum.any?(movies, &(&1["id"] == movie.id))
    end
  end

  test "returns 404 for missing movie", %{conn: conn} do
    assert_error_sent(404, fn ->
      get(conn, "/api/movies/999999")
    end)
  end

  test "id does exist", %{conn: conn} do
    conn = get(conn, "/api/movies")

    assert json_response(conn, 200)
  end

  test " create new movie", %{conn: conn} do
  end
end
