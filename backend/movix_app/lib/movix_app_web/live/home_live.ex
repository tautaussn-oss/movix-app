defmodule MovixAppWeb.HomeLive do
  use MovixAppWeb, :live_view

  alias MovixApp.Movies

  def mount(params, _session, socket) do
    socket = assign(socket, Movies.filter_movies(params))

    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <h1>Nikola</h1>
    <div class="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <h1 class="text-3xl font-bold mb-8 text-white tracking-tight">🎬 All Movies</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          :for={movie <- @movies}
          class="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-600 transition"
        >
          <h2 class="text-lg font-semibold text-white">{movie.title}</h2>
          <p class="text-sm text-zinc-400 mt-1">{movie.year}</p>
          <p class="text-sm text-zinc-500 mt-2 line-clamp-3">{movie.description}</p>
        </div>
      </div>
    </div>

    <div class=""></div>
    """
  end
end
