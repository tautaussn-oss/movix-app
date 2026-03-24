defmodule MovixAppWeb.Api.CloudinaryHelper do
  def maybe_put(map, _key, nil), do: map
  def maybe_put(map, key, value), do: Map.put(map, key, value)

  def upload_to_cloudinary(%Plug.Upload{path: path}) do
    case Cloudex.upload(path, %{folder: "movies"}) do
      {:ok, result} ->
        {:ok, %{url: result.secure_url, public_id: result.public_id}}

      {:error, err} ->
        {:error, err}
    end
  end

  def upload_to_cloudinary(_), do: {:error, :no_file}

  def handle_poster_update(movie, %{"poster" => %Plug.Upload{} = file}) do
    with {:ok, %{url: url, public_id: public_id}} <- upload_to_cloudinary(file),
         :ok <- delete_from_cloudinary(movie.public_id_cloudinary) do
      {:ok, %{url: url, public_id: public_id}}
    end
  end

  def handle_poster_update(_movie, _params) do
    {:ok, %{url: nil, public_id: nil}}
  end

  def delete_from_cloudinary(nil), do: :ok

  def delete_from_cloudinary(public_id) do
    case Cloudex.delete(public_id) do
      {:ok, _} ->
        :ok

      {:error, reason} ->
        {:error, reason}
    end
  end
end
