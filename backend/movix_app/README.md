# MovixApp

Overview:

Simple movie app for viewing and rating movies and displaying their information.


My API endpoints: 

https://movix-app-az3n.onrender.com/api/movies

https://movix-app-az3n.onrender.com/api/movies/:id

https://movix-app-az3n.onrender.com/api/genres

https://movix-app-az3n.onrender.com/api/genres/:id

Follow link (cmd + click)

  ``` get("/movies", MoviesController, :index)
    get("/movies/:id", MoviesController, :show)

    get("/genres", GenresController, :index)
    get("/genres/:id", GenresController, :show)

    get("/movies/:id/next", MoviesController, :next)
    get("/movies/:id/prev", MoviesController, :prev)

    post("/movies", MoviesController, :create)
    
    put("/ratings/:id", RatingsController, :create)
    put("/movies/:id", MoviesController, :update)

    delete("/movies/:id", MoviesController, :delete) 
    
    ```