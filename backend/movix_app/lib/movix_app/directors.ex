defmodule MovixApp.Directors do
  alias MovixApp.Repo
  alias MovixApp.Directors.Director

  def list_directors() do
    Repo.all(Director)
  end
end
