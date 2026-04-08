defmodule MovixApp.MoviesTest do
  use MovixApp.DataCase

  import MovixApp.Fixtures
  alias MovixApp.Genres.Genre
  alias MovixApp.Directors.Director
  alias MovixApp.Movies.Movie
  alias MovixApp.Repo
  alias MovixApp.Movies

  describe "get_movie/1" do
    test "returns success when movie is found" do
      movie = movie_fixture()

      assert {:ok, fetched_movie} = Movies.get_movie(movie.id)
      assert fetched_movie.id == movie.id
    end

    test "returns not_found error when provided with wrong movie id" do
      movie = movie_fixture()
      assert {:error, :not_found} == Movies.get_movie("9999999")
    end

    test "returns invalid_id error when provided with wrong id type" do
      movie = movie_fixture()
      assert {:error, :invalid_id} == Movies.get_movie("abc")
    end
  end

  describe "list directors/0" do
    test "list all directors from table directors with their full names" do
      director1 = director_fixture()
      director2 = director_fixture()

      directors = Movies.list_directors()

      assert length(directors) == 2
      assert Enum.all?(directors, fn d -> d.name == "Quentin" and d.surname == "Tarantino" end)
      refute Enum.any?(directors, fn d -> d.name == "Steven" and d.surname == "Speilverg" end)
    end
  end

  describe "filter_movies/1" do
    test "returns movies filtered by featured flag = true" do
      false_movie1 = movie_fixture(%{featured: false})
      false_movie2 = movie_fixture(%{featured: false})
      true_movies = movies_fixture()

      filter = %{"featured" => "true"}

      movie_filtered =
        Movies.filter_movies(filter)

      assert length(movie_filtered) == 10
      assert Enum.all?(movie_filtered, fn m -> m.featured == true end)
    end

    test "returns movies unchanged if filter not present" do
      movies = movies_fixture(10)
      filter = %{}
      movies_filtered = Movies.filter_movies(filter)

      assert movies == movies_filtered
      assert length(movies_filtered) == 10
    end

    test "returns movies filtered by search parameter" do
      movie_dja = movie_fixture(%{title: "Django"})
      movies = movies_fixture(9)

      # stavio sam dja, da bih testirao u filter_movies da li je case insensitive
      movies_filtered = Movies.filter_movies(%{"search" => "dja"})

      assert Enum.all?(movies_filtered, fn m -> String.contains?(m.title, "Dja") end)
    end

    test "returns movies sorted by title" do
      # default je napraviti 10 filmova s movie_fixture
      movies = movies_fixture()

      movies_sorted = Movies.filter_movies(%{"sort_by" => "title"})

      titles = Enum.map(movies_sorted, fn m -> m.title end)

      assert titles == Enum.sort(titles)
    end

    test "returns movies sorted by year" do
      movies = movies_fixture()

      movies_sorted = Movies.filter_movies(%{"sort_by" => "year"})

      years = Enum.map(movies_sorted, fn m -> m.year end)

      assert years == Enum.sort(years, :desc)
    end

    test "returns movies sorted by rating" do
      movie1 = movie_fixture(%{ratings: [1, 2, 3, 4]})
      movie2 = movie_fixture(%{ratings: [5, 6]})
      movie3 = movie_fixture(%{ratings: [1, 8, 3, 4]})
      movie4 = movie_fixture(%{ratings: [1, 2, 3, 4, 1, 2]})
      movie5 = movie_fixture(%{ratings: [1, 0, 3, 4]})
      movie6 = movie_fixture(%{ratings: [1, 2, 3, 4]})
      movie7 = movie_fixture(%{ratings: [4, 2, 10, 4, 7]})

      movies_sorted = Movies.filter_movies(%{"sort_by" => "rating"})

      ratings = Enum.map(movies_sorted, fn m -> m.rating_avg end)

      assert ratings == Enum.sort(ratings, :desc)
    end

    test "returns movies sorted by popularity and only 6" do
      movie1 = movie_fixture(%{ratings: [1, 2, 3, 4]})
      movie2 = movie_fixture(%{ratings: [5, 6]})
      movie3 = movie_fixture(%{ratings: [1, 8, 3, 4]})
      movie4 = movie_fixture(%{ratings: [1, 2, 3, 4, 1, 2]})
      movie5 = movie_fixture(%{ratings: [1, 0, 3, 4]})
      movie6 = movie_fixture(%{ratings: [1, 2, 3, 4]})
      movie7 = movie_fixture(%{ratings: [4, 2, 10, 4, 7]})

      movies_sorted = Movies.filter_movies(%{"sort_by" => "popular"})

      popular = Enum.map(movies_sorted, fn m -> m.rating_count end)

      assert length(popular) == 6
      assert length(movies_sorted) == 6
      assert popular == Enum.sort(popular, :desc)
    end
  end

  describe "get_next_movie/1" do
    test "returns id of next movie when it is not last movie" do
      movie1 = movie_fixture()
      movie2 = movie_fixture()
      movie3 = movie_fixture()

      {:ok, result} = Movies.get_next_movie(movie1.id)

      assert result.id == movie2.id
    end

    test "returns error when it is last movie or invalid id" do
      movie1 = movie_fixture()
      movie2 = movie_fixture()
      movie3 = movie_fixture()

      assert {:error, :not_found} == Movies.get_next_movie(movie3.id)
      assert {:error, :invalid_id} == Movies.get_next_movie("abc")
    end
  end

  describe "get_prev_movie/1" do
    test "returns id of previous movie when it is not first movie" do
      movie1 = movie_fixture()
      movie2 = movie_fixture()
      movie3 = movie_fixture()

      {:ok, result} = Movies.get_prev_movie(movie2.id)

      assert result.id == movie1.id
    end

    test "returns error when it is first movie or invalid id" do
      movie1 = movie_fixture()
      movie2 = movie_fixture()
      movie3 = movie_fixture()

      assert {:error, :not_found} == Movies.get_prev_movie(movie1.id)
      assert {:error, :invalid_id} == Movies.get_prev_movie("abc")
    end
  end

  describe "get_related_movies/1" do
    test "returns index no found" do
      assert {:error, :not_found} == Movies.get_related_movies(99999)
    end

    test "returns invalid id error" do
      assert {:error, :invalid_id} == Movies.get_related_movies("abc")
    end

    test "returns list of movies that have genres in common with original movie" do
      genre1 = genre_fixture("Action")
      genre2 = genre_fixture("Drama")
      genre3 = genre_fixture("Sci-Fi")
      genre4 = genre_fixture("Comedy")

      movie1 = movie_fixture(%{genres: [genre1, genre2]})
      movie2 = movie_fixture(%{genres: [genre1]})
      movie3 = movie_fixture(%{genres: [genre3, genre4]})

      {:ok, related_movies} = Movies.get_related_movies(movie1.id)

      ids = Enum.map(related_movies, fn movie -> movie.id end)

      assert movie2.id in ids
      refute movie1.id in ids
      refute movie3.id in ids
    end

    test "returns at most 6 related movies" do
      genre = genre_fixture("Action")

      movie1 = movie_fixture(%{genres: [genre]})
      movie2 = movie_fixture(%{genres: [genre]})
      movie3 = movie_fixture(%{genres: [genre]})
      movie4 = movie_fixture(%{genres: [genre]})
      movie5 = movie_fixture(%{genres: [genre]})
      movie6 = movie_fixture(%{genres: [genre]})
      movie7 = movie_fixture(%{genres: [genre]})
      movie8 = movie_fixture(%{genres: [genre]})
      movie9 = movie_fixture(%{genres: [genre]})

      movies = Movies.list_all()

      {:ok, related_movies} = Movies.get_related_movies(movie1.id)

      assert Enum.count(related_movies) != Enum.count(movies)
      assert Enum.count(related_movies) == 6
    end
  end

  describe "create_movie/1" do
    test "returns new movie and adds it into database" do
      genre1 = genre_fixture("Action")
      genre2 = genre_fixture("Drama")

      attrs = %{
        "title" => "Film",
        "description" => "Filmcina",
        "director" => "Robert Lewandowski",
        "duration" => "120",
        "year" => "1950",
        "featured" => "true",
        "genres" => ["Action", "Drama"],
        "poster" => "url",
        "public_id_cloudinary" => "123456"
      }

      {:ok, movie} = Movies.create_movie(attrs)
      assert movie.id == Repo.one(Movie).id
    end

    test "fail to create movie" do
    end
  end

  describe "update_movie/1" do
    test "returns updated movie" do
      movie = movie_fixture()

      attrs = %{
        "title" => "Film",
        "description" => "Filmcina",
        "director" => "Robert Lewandowski",
        "duration" => "120",
        "year" => "1950",
        "featured" => "true",
        "genres" => ["Action"],
        "poster" => "url",
        "public_id_cloudinary" => "123456"
      }

      {:ok, updated_movie} = Movies.update_movie(movie, attrs)

      assert movie.id == updated_movie.id
      assert movie.title != updated_movie.title
    end
  end

  describe "delete_movie/1" do
    test "returns success and deletes the movie" do
      movie = movie_fixture()

      {:ok, deleted_movie} = Movies.delete_movie(movie)
      assert movie.id == deleted_movie.id
      assert Repo.all(Movie) == []
    end

    test "returns error when invalid movie to delete" do
      movie = %Movie{id: -1}

      assert {:error, "Failed to delete movie"} == Movies.delete_movie(movie)
    end
  end
end
