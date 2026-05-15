defmodule MovixAppWeb.MoviesLive.Show do
  use MovixAppWeb, :live_view

  alias MovixApp.Movies
  alias MovixApp.Ratings

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(%{"id" => id}, _uri, socket) do
    {:ok, movie} = Movies.get_movie(id)

    movie_next =
      case Movies.get_next_movie(id) do
        {:ok, movie} -> movie
        {:error, :not_found} -> nil
      end

    movie_prev =
      case Movies.get_prev_movie(id) do
        {:ok, movie} -> movie
        {:error, :not_found} -> nil
      end

    movies_related =
      case Movies.get_related_movies(id) do
        {:ok, movies} -> movies
        {:error, _} -> nil
      end

    socket =
      socket
      |> assign(:movie, movie)
      |> assign(:movie_next, movie_next)
      |> assign(:movie_prev, movie_prev)
      |> assign(:form, to_form(%{}, as: :rating))
      |> stream(:movies_related, movies_related, reset: true)

    {:noreply, socket}
  end

  def render(assigns) do
    ~H"""
    <div class="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="space-y-8">
        <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div class="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
            <img
              src={@movie.poster}
              class="mx-auto h-80 w-full max-w-[340px] rounded-[1.5rem] object-cover shadow-lg"
            />
            <div class="space-y-6">
              <div>
                <h1 class="text-3xl font-semibold text-slate-900">{@movie.title}</h1>
                <p class="mt-3 text-sm text-slate-500">Year: {@movie.year}</p>
                <p class="mt-3 text-sm text-slate-500">
                  Director: {@movie.director.name} {@movie.director.surname}
                </p>
              </div>
              <p class="text-slate-700">{@movie.description}</p>
              <div class="grid gap-4 sm:grid-cols-2 items-center rounded-3xl bg-slate-50 p-5 text-slate-700">
                <p class="text-lg font-medium">
                  Rating: <span class="text-slate-900">{Float.round(@movie.rating_avg, 1)}</span>
                </p>
                <.simple_form for={@form} phx-submit="rate" class="flex items-center gap-3">
                  <.input
                    field={@form[:value]}
                    type="select"
                    options={1..10}
                    prompt="Rate this movie"
                  />
                  <.button>Rate</.button>
                </.simple_form>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div class="flex flex-wrap gap-3">
            <%= if @movie_prev do %>
              <button phx-click="prev_movie" class="btn text-center">Previous</button>
            <% end %>
            <%= if @movie_next do %>
              <button phx-click="next_movie" class="btn text-center">Next</button>
            <% end %>
            <button phx-click="edit_movie" class="btn text-center">Edit</button>
            <button phx-click="delete_movie" class="btn btn-error text-center">
              Delete this movie
            </button>
          </div>
        </div>

        <%= if Enum.any?(@streams.movies_related.inserts) do %>
          <div class="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 class="text-xl font-semibold text-slate-900">Related Movies</h2>
            <div
              id="related-movies"
              phx-update="stream"
              class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              <%= for {dom_id, movie} <- @streams.movies_related do %>
                <div
                  id={dom_id}
                  class="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <.link
                    patch={~p"/movies/#{movie.id}"}
                    onclick="window.scrollTo(0, 0)"
                    class="block p-4"
                  >
                    <img src={movie.poster} class="mb-4 h-48 w-full rounded-[1.25rem] object-cover" />
                    <h3 class="text-lg font-semibold text-slate-900">{movie.title}</h3>
                  </.link>
                </div>
              <% end %>
            </div>
          </div>
        <% end %>

        <.link navigate="/movies" class="btn mt-2 block w-full text-center sm:w-auto">
          Back to Movies
        </.link>
      </div>
    </div>
    """
  end

  def handle_event("rate", %{"rating" => %{"value" => value}}, socket) do
    movie_id = socket.assigns.movie.id

    case Integer.parse(value) do
      {rating, ""} when rating in 1..10 ->
        {:ok, updated_movie} = Ratings.add_rating(movie_id, rating)
        {:noreply, assign(socket, :movie, updated_movie)}

      _ ->
        {:noreply, put_flash(socket, :error, "Invalid rating value")}
    end
  end

  def handle_event("delete_movie", _unsigned_params, socket) do
    {:ok, movie} = Movies.get_movie(socket.assigns.movie.id)
    {:ok, _} = Movies.delete_movie(movie)
    socket = push_navigate(socket, to: "/movies")
    {:noreply, socket}
  end

  def handle_event("next_movie", _params, socket) do
    next_id = socket.assigns.movie_next.id
    socket = push_patch(socket, to: "/movies/#{next_id}")
    {:noreply, socket}
  end

  def handle_event("prev_movie", _params, socket) do
    prev_id = socket.assigns.movie_prev.id
    socket = push_patch(socket, to: "/movies/#{prev_id}")
    {:noreply, socket}
  end

  def handle_event("edit_movie", _params, socket) do
    movie_id = socket.assigns.movie.id
    socket = push_navigate(socket, to: "/admin/movies/#{movie_id}/edit")
    {:noreply, socket}
  end
end
