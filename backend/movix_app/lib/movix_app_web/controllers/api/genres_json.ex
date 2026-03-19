defmodule MovixAppWeb.Api.GenresJSON do
  def index(%{genres: genres}) do
    %{
      genres:
        for(
          genre <- genres,
          do: data(genre)
        )
    }
  end

  def show(%{genre: genre}) do
    data(genre)
  end

  defp data(genre) do
    %{
      id: genre.id,
      genre: genre.genre
      # movies:
    }
  end
end
