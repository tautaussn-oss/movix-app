# test/support/fixtures.ex
defmodule MovixApp.Fixtures do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director

  defp random_bool, do: Enum.random([true, false])

  def director_fixture do
    Repo.insert!(%Director{name: "Quentin", surname: "Tarantino"})
  end

  def genre_fixture(name \\ "Action") do
    Repo.get_by(Genre, name: name) ||
      Repo.insert!(%Genre{name: name})
  end

  def movie_fixture(attrs \\ %{}) do
    director = director_fixture()
    _genre = genre_fixture()

    movie =
      %Movie{
        title: "Movie #{System.unique_integer()}",
        year: 2020,
        description: "desc",
        duration: 120,
        featured: random_bool(),
        poster: "url",
        public_id_cloudinary: "pid",
        director_id: director.id,
        rating_all: 0,
        rating_avg: 0.0,
        rating_count: 0
      }
      |> Map.merge(attrs)
      |> Repo.insert!()

    Repo.preload(movie, [:genres, :director, :ratings])
  end

  def movies_fixture(count \\ 10, attrs \\ %{}) do
    Enum.map(1..count, fn _ ->
      movie_fixture(attrs)
    end)
  end
end
