# test/support/fixtures.ex
defmodule MovixApp.Fixtures do
  alias MovixApp.Repo
  alias MovixApp.Movies.Movie
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director

  def director_fixture do
    Repo.insert!(%Director{name: "Quentin", surname: "Tarantino"})
  end

  def genre_fixture(name \\ "Action") do
    Repo.insert!(%Genre{genre: name})
  end

  def movie_fixture(attrs \\ %{}) do
    director = director_fixture()
    genre = genre_fixture()

    movie =
      %Movie{
        title: "Movie #{System.unique_integer()}",
        year: 2020,
        description: "desc",
        duration: 120,
        featured: false,
        poster: "url",
        public_id_cloudinary: "pid",
        director_id: director.id
      }
      |> Map.merge(attrs)
      |> Repo.insert!()

    Repo.preload(movie, [:genres, :director])
  end
end
