defmodule MovixAppWeb.PageController do
  use MovixAppWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
