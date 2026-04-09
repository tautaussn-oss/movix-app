defmodule MovixApp.DirectorsTest do
  use MovixApp.DataCase

  alias MovixApp.Directors
  alias MovixApp.MoviesHelper
  import MovixApp.Fixtures

  describe "list directors/0" do
    test "list all directors from table directors with their full names" do
      director_fixture()
      director_fixture()

      directors = Directors.list_directors()

      assert length(directors) == 2
      assert Enum.all?(directors, fn d -> d.name == "Quentin" and d.surname == "Tarantino" end)
      refute Enum.any?(directors, fn d -> d.name == "Steven" and d.surname == "Spielberg" end)
    end
  end

  describe "get_director_by_full_name/1" do
    test "returns success when it finds director" do
      director_fixture()

      assert {:ok, _director} = MoviesHelper.get_director_by_full_name("Quentin Tarantino")
    end
  end
end
