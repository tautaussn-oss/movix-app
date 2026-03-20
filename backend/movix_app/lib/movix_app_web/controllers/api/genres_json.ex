defmodule MovixAppWeb.Api.GenresJSON do
  alias MovixAppWeb.Api.MoviesJSON

  def index(%{genres: genres}) do
    %{
      genres:
        for(
          genre <- genres,
          do: datag(genre)
        )
    }
  end

  def show(%{genre: genre}) do
    data(genre)
  end

  defp datag(genre) do
    %{
      id: genre.id,
      genre: genre.genre
    }
  end

  defp data(genre) do
    %{
      id: genre.id,
      genre: genre.genre,
      movies: Enum.map(genre.movies, fn m -> MoviesJSON.data_movie(m) end)
    }
  end
end
