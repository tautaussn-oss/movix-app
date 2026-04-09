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

  def show_id(%{movie: movie}) do
    data_movie_id(movie)
  end

  def data_movie_id(nil) do
    nil
  end

  def data_movie_id(movie) do
    %{
      id: movie.id
    }
  end

  def data_movie(movie) do
    %{
      id: movie.id,
      title: movie.title,
      year: movie.year,
      description: movie.description,
      duration: movie.duration,
      poster: movie.poster,
      featured: movie.featured,
      genres: Enum.map(movie.genres, fn g -> g.name end),
      rating: movie.rating_avg,
      director: "#{movie.director.name} #{movie.director.surname}"
    }
  end
end
