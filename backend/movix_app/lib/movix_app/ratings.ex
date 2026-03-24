defmodule MovixApp.Ratings do
  alias MovixApp.Repo
  alias MovixApp.Ratings.Rating

  def create_rating(attrs) do
    %Rating{}
    |> Rating.changeset(attrs)
    |> Repo.insert()
  end
end
