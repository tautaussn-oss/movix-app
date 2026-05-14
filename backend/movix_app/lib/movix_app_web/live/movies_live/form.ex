defmodule MovixAppWeb.MoviesLive.Form do
  use MovixAppWeb, :live_view

  alias MovixApp.Genres
  alias MovixApp.Movies.Movie
  alias MovixApp.Movies
  alias MovixApp.CloudinaryHelper

  def mount(params, _session, socket) do
    socket =
      socket
      |> assign(:genre_options, Genres.genre_names())
      |> allow_upload(:poster, accept: ~w(.jpg .jpeg .png), max_entries: 1)
      |> apply_action(socket.assigns.live_action, params)

    {:ok, socket}
  end

  defp apply_action(socket, :new, _params) do
    movie = %Movie{}
    changeset = Movies.change_movie(movie)

    socket
    |> assign(:page_title, "New Movie")
    |> assign(:form, to_form(changeset))
    |> assign(:movie, movie)
    |> assign(:director_name, "")
    |> assign(:selected_genres, [])
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    {:ok, movie} = Movies.get_movie(id)
    changeset = Movies.change_movie(movie)

    director_name =
      if movie.director, do: movie.director.name <> " " <> movie.director.surname, else: ""

    selected_genres = Enum.map(movie.genres, & &1.name)

    socket
    |> assign(:page_title, "Edit Movie")
    |> assign(:form, to_form(changeset))
    |> assign(:movie, movie)
    |> assign(:director_name, director_name)
    |> assign(:selected_genres, selected_genres)
  end

  def render(assigns) do
    ~H"""
    <div class="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <.header>
        {@page_title}
      </.header>

      <.simple_form
        for={@form}
        id="movie-form"
        phx-submit="save"
        phx-change="validate"
        class="mx-auto w-full max-w-3xl rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-900/5"
      >
        <.input field={@form[:title]} label="Title" />
        <.input field={@form[:year]} type="number" label="Year" />
        <.input field={@form[:description]} type="textarea" label="Description" phx-debounce="blur" />
        <.input field={@form[:duration]} type="number" label="Duration" />
        <.input type="text" name="movie[director]" label="Director Name" value={@director_name} />
        <.input
          field={@form[:featured]}
          type="select"
          label="Featured"
          prompt="Change featured status"
          options={[true, false]}
        />
        <.live_file_input upload={@uploads.poster} />
        <.input
          type="select"
          name="movie[genres]"
          options={@genre_options}
          value={@selected_genres}
          multiple
        />

        <.button phx-disable-with="Saving..."> Save Movie </.button>
      </.simple_form>

      <.back navigate="/movies">
        Back
      </.back>
    </div>
    """
  end

  def handle_event("validate", %{"movie" => movie_params}, socket) do
    changeset = Movies.change_movie(socket.assigns.movie, movie_params)
    socket = assign(socket, :form, to_form(changeset, action: :validate))

    {:noreply, socket}
  end

  def handle_event("save", %{"movie" => movie_params}, socket) do
    uploaded_files =
      consume_uploaded_entries(socket, :poster, fn meta, _entry ->
        case CloudinaryHelper.handle_poster_update(socket.assigns.movie, %{
               "poster" => %Plug.Upload{
                 path: meta.path,
                 filename: "poster.png"
               }
             }) do
          {:ok, result} ->
            {:ok, result}

          {:error, reason} ->
            {:postpone, reason}
        end
      end)

    case uploaded_files do
      [] ->
        if socket.assigns.live_action == :new do
          socket =
            socket
            |> put_flash(:error, "Poster is required")
            |> assign(:form, to_form(Movies.change_movie(socket.assigns.movie, movie_params)))

          {:noreply, socket}
        else
          save_movie(socket, socket.assigns.live_action, movie_params)
        end

      [%{url: url, public_id: public_id}] ->
        movie_params =
          movie_params
          |> Map.put("poster", url)
          |> Map.put("public_id_cloudinary", public_id)

        save_movie(socket, socket.assigns.live_action, movie_params)

      [{:error, reason}] ->
        socket =
          socket
          |> put_flash(:error, "Failed to upload poster: #{inspect(reason)}")
          |> assign(:form, to_form(Movies.change_movie(socket.assigns.movie, movie_params)))

        {:noreply, socket}
    end
  end

  defp save_movie(socket, :new, movie_params) do
    case Movies.create_movie(movie_params) do
      {:ok, _movie} ->
        socket =
          socket
          |> put_flash(:info, "Movie created successfully!")
          |> push_navigate(to: "/movies")

        {:noreply, socket}

      {:error, %Ecto.Changeset{} = changeset} ->
        socket = assign(socket, :form, to_form(changeset))
        {:noreply, socket}

      {:error, reason} ->
        socket =
          socket
          |> put_flash(:error, "Failed to create movie: #{inspect(reason)}")
          |> assign(:form, to_form(Movies.change_movie(socket.assigns.movie, movie_params)))

        {:noreply, socket}
    end
  end

  defp save_movie(socket, :edit, movie_params) do
    case Movies.update_movie(socket.assigns.movie, movie_params) do
      {:ok, _movie} ->
        socket =
          socket
          |> put_flash(:info, "Movie updated successfully!")
          |> push_navigate(to: "/movies/#{socket.assigns.movie.id}")

        {:noreply, socket}

      {:error, %Ecto.Changeset{} = changeset} ->
        socket = assign(socket, :form, to_form(changeset))
        {:noreply, socket}

      {:error, reason} ->
        socket =
          socket
          |> put_flash(:error, "Failed to update movie: #{inspect(reason)}")
          |> assign(:form, to_form(Movies.change_movie(socket.assigns.movie, movie_params)))

        {:noreply, socket}
    end
  end
end
