defmodule MovixAppWeb.Api.MoviesJSON do
  def index(%{movies: movies}) do
    %{
      movies:
        for(
          movie <- movies,
          do: data_movie(movie)
        )
    }
  end

  def show(%{movie: movie}) do
    data_movie(movie)
  end

  def data_movie(movie) do
    rating_values = Enum.map(movie.ratings, fn r -> r.rating end)

    average =
      case rating_values do
        [] -> nil
        _ -> Enum.sum(rating_values) / length(rating_values)
      end

    %{
      id: movie.id,
      title: movie.title,
      year: movie.year,
      description: movie.description,
      duration: movie.duration,
      poster: movie.poster,
      featured: movie.featured,
      genres: Enum.map(movie.genres, fn g -> g.genre end),
      rating: average,
      director: "#{movie.director.name} #{movie.director.surname}"
    }
  end
end
