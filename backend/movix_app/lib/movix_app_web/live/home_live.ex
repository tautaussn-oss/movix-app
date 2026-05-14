defmodule MovixAppWeb.HomeLive do
  use MovixAppWeb, :live_view

  alias MovixApp.Movies

  def mount(_params, _session, socket) do
    socket = assign(socket, :movies, Movies.list_all())

    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">All Movies</h1>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          :for={movie <- @movies}
          class="border rounded-lg p-3"
        >
          <h2 class="font-semibold">{movie.title}</h2>
          <p class="text-sm text-gray-500">{movie.year}</p>
          <p class="text-sm mt-1">{movie.description}</p>
        </div>
      </div>
    </div>
    """
  end
end
