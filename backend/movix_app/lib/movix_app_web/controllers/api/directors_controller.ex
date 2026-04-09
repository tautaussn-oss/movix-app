defmodule MovixAppWeb.Api.DirectorsController do
  use MovixAppWeb, :controller

  alias MovixApp.Directors

  def directors(conn, _params) do
    directors = Directors.list_directors()
    render(conn, :show_directors, directors: directors)
  end
end
