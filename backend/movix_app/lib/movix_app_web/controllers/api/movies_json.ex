defmodule MovixAppWeb.Api.MoviesJSON do
  def index(%{movies: movies}) do
    %{
      movies:
        for(
          movie <- movies,
          do: data(movie)
        )
    }
  end

  defp data(movie) do
    %{
      id: movie.id,
      title: movie.title,
      year: movie.year,
      description: movie.description,
      duration: movie.duration
    }
  end
end
