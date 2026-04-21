defmodule MovixApp.CloudinaryHelper do
  @moduledoc """
    Helper module for functions that use to cloudinary service
    such as create_movie/1 which uploads movie poster to cloudinary
  """

  @doc """
  Puts value into map if value is not nil, otherwise map is unchanged
  Used for when movie is updated but poster stays the same
  """
  def maybe_put(map, _key, nil), do: map
  def maybe_put(map, key, value), do: Map.put(map, key, value)

  @doc """
  Uploads image to cloudinary cloud service
  Returns url/path/link to that image that will be inserted into database and public_id of that image thich will be also inserted
  """
  def upload_to_cloudinary(%Plug.Upload{path: path}) do
    case Cloudex.upload(path, %{folder: "movies"}) do
      {:ok, result} ->
        {:ok, %{url: result.secure_url, public_id: result.public_id}}

      {:error, err} ->
        {:error, err}
    end
  end

  def upload_to_cloudinary(_), do: {:error, :no_file}

  @doc """
  This function handles that movie update is handled properly
  It ensures that after new image (movie poster) is uploaded, old one is deleted from cloudinary folder
  """
  def handle_poster_update(movie, %{"poster" => %Plug.Upload{} = file}) do
    with {:ok, %{url: url, public_id: public_id}} <- upload_to_cloudinary(file),
         :ok <- delete_from_cloudinary(movie.public_id_cloudinary) do
      {:ok, %{url: url, public_id: public_id}}
    end
  end

  def handle_poster_update(_movie, _params) do
    {:ok, %{url: nil, public_id: nil}}
  end

  @doc """
  Deletes image from cloudinary folder
  Takes public_id of the image(movie poster) which will be deleted
  """
  def delete_from_cloudinary(nil), do: :ok

  def delete_from_cloudinary(public_id) do
    Cloudex.delete(public_id)
    :ok
  end
end
