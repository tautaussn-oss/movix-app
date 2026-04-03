defmodule MovixApp.Directors do
  alias MovixApp.Repo
  alias MoviesApp.Directors.Director

  def list_directors() do
    Repo.all(Director)
  end
end
