defmodule MovixAppWeb.Api.DirectorsJSON do
  def show_directors(%{directors: directors}) do
    %{
      directors:
        for(
          director <- directors,
          do: data_director(director)
        )
    }
  end

  def data_director(director) do
    %{
      id: director.id,
      full_name: "#{director.name} #{director.surname}"
    }
  end
end
