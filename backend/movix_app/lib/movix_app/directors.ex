defmodule MovixApp.Directors do
  alias MovixApp.Repo
  alias MovixApp.Directors.Director

  @moduledoc """
  Conext module for Directors
  """

  @doc """
  Returns all directors
  """
  def list_directors() do
    Repo.all(Director)
  end
end
