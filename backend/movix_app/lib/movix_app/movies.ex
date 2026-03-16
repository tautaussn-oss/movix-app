defmodule MovixApp.Movies do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie

  def list_all do
    Repo.all(Movie)
  end
end
