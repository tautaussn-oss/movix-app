defmodule MovixApp.Fixtures do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie
  alias MovixApp.Genres.Genre
  alias MovixApp.Ratings
  alias MovixApp.Directors.Director

  def director_fixture do
    Repo.insert!(%Director{name: "Quentin", surname: "Tarantino"})
  end

  def genre_fixture(name \\ "Action") do
    Repo.get_by(Genre, name: name) ||
      Repo.insert!(%Genre{name: name})
  end

  def movie_fixture(attrs \\ %{}) do
    director = director_fixture()
    genres = Map.get(attrs, :genres, [genre_fixture()])
    ratings = Map.get(attrs, :ratings, [])

    movie_attrs =
      %{
        title: "Movie #{System.unique_integer()}",
        year: 2020,
        description: "description",
        duration: 120,
        featured: true,
        poster: "url",
        public_id_cloudinary: "pid",
        director_id: director.id
      }
      |> Map.merge(Map.drop(attrs, [:genres, :ratings]))

    movie =
      %Movie{}
      |> Movie.changeset(movie_attrs)
      |> Ecto.Changeset.put_assoc(:genres, genres)
      |> Repo.insert!()

    # apply ratings through real logic
    Enum.each(ratings, fn r ->
      Ratings.add_rating(movie.id, r)
    end)

    # preload = CRITICAL
    Repo.get!(Movie, movie.id)
    |> Repo.preload([:genres, :director, :ratings])
  end

  def movies_fixture(count \\ 10, attrs \\ %{}) do
    Enum.map(1..count, fn _ ->
      movie_fixture(attrs)
    end)
  end
end
