defmodule MovixAppWeb.MoviesControllerTest do
  use MovixAppWeb.ConnCase
  doctest MovixAppWeb.Api.MoviesController

  test "Movies GET /", %{conn: conn} do
    conn = get(conn, "/api/movies")

    assert json_response(conn, 200)
  end

  test "id does exist", %{conn: conn} do
    conn = get(conn, "/api/movies")

    assert json_response(conn, 200)
  end
end
