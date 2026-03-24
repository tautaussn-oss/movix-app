# MovixApp

My API endpoints: 

https://movix-app-az3n.onrender.com/api/movies
https://movix-app-az3n.onrender.com/api/movies/:id
https://movix-app-az3n.onrender.com/api/genres
https://movix-app-az3n.onrender.com/api/genres/:id
Follow link (cmd + click)

    get("/movies", MoviesController, :index)
    get("/movies/:id", MoviesController, :show)
    get("/genres", GenresController, :index)
    get("/genres/:id", GenresController, :show)
    post("/movies", MoviesController, :create)
    post("/ratings/:id", RatingsController, :create)
    put("/movies/:id", MoviesController, :update)
    delete("/movies/:id", MoviesController, :delete)