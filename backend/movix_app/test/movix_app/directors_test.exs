defmodule MovixApp.DirectorsTest do
  use MovixApp.DataCase

  alias MovixApp.Directors
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
end
