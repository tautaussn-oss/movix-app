defmodule MovixAppWeb.MoviesLive.Index do
  use MovixAppWeb, :live_view

  import URI
  alias MovixApp.Movies
  alias MovixApp.Genres

  def mount(_params, _session, socket) do
    socket = assign(socket, :genres, Genres.genre_names())

    {:ok, socket}
  end

  def handle_params(params, _uri, socket) do
    socket =
      socket
      |> assign(page_title: "Movies")
      |> assign(:form, to_form(params))
      |> stream(:movies, Movies.filter_movies(params), reset: true)

    {:noreply, socket}
  end

  def render(assigns) do
    ~H"""
    <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="space-y-8">
        <div class="mx-auto w-full max-w-4xl">
          <.filter_form form={@form} genres={@genres} />
        </div>

        <div class="movies grid gap-6 sm:grid-cols-2 xl:grid-cols-3" id="movies" phx-update="stream">
          <div
            id="empty"
            class="no-results only:block hidden rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm"
          >
            No movies found. Try changing your filters.
          </div>
          <.movie_card
            :for={{dom_id, movie} <- @streams.movies}
            movie={movie}
            id={dom_id}
          />
        </div>
      </div>
    </div>
    """
  end

  def filter_form(assigns) do
    ~H"""
    <.form
      for={@form}
      id="filter-form"
      phx-change="filter"
      phx-submit="filter"
      class="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-5"
    >
      <.input
        class="sm:col-span-2"
        field={@form[:search]}
        placeholder="Search..."
        autocomplete="on"
        phx-debounce="500"
      />
      <.input
        type="select"
        field={@form[:featured]}
        prompt="Featured"
        options={[true, false]}
        class="text-center"
      />
      <.input
        type="select"
        field={@form[:genre]}
        prompt="Genre"
        options={@genres}
        class="text-center"
      />
      <.input
        type="select"
        field={@form[:sort_by]}
        prompt="Sort By"
        options={[
          Title: "title",
          Rating: "rating",
          Year: "year",
          Genre: "genre"
        ]}
        class="text-center"
      />
      <.link
        patch="/movies"
        class="btn btn-outline justify-center justify-self-center sm:col-span-2 lg:col-span-1"
      >
        Reset
      </.link>
    </.form>
    """
  end

  attr(:movie, MovixApp.Movies.Movie, required: true)
  attr(:id, :string, required: true)

  def movie_card(assigns) do
    ~H"""
    <.link navigate={"/movies/#{@movie.id}"} id={@id} class="group">
      <div class="card overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div class="genre text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {Enum.map_join(@movie.genres, ", ", & &1.name)}
        </div>
        <img src={@movie.poster} class="mt-4 h-56 w-full rounded-[1.5rem] object-cover" />
        <h2 class="mt-5 text-lg font-semibold text-slate-900">{@movie.title}</h2>
        <div class="details mt-4 flex items-center justify-between text-sm text-slate-600">
          <div class="rating">⭐ {Float.round(@movie.rating_avg, 1)}</div>
        </div>
      </div>
    </.link>
    """
  end

  def handle_event("filter", params, socket) do
    params =
      params
      |> Map.take(~w(search featured sort_by genre))
      |> Map.reject(fn {_, v} -> v == "" end)

    IO.inspect(params, label: "FILTER PARAMS")
    {:noreply, push_patch(socket, to: "/movies?#{encode_query(params)}")}
  end
end
