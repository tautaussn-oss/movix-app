defmodule MovixApp.Repo do
  use Ecto.Repo,
    otp_app: :movix_app,
    adapter: Ecto.Adapters.Postgres
end
