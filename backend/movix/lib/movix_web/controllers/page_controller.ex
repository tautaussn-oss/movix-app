defmodule MovixWeb.PageController do
  use MovixWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
