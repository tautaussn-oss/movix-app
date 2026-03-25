const STORAGE_KEY='favorites'

export const getFavorites=():number[]=>{
    const stored=localStorage.getItem(STORAGE_KEY);
    try{
        return stored?JSON.parse(stored):[]
    }catch(e){
        console.log(e);
        console.log('Invalid JSON string encountered for the favorites key in local storage!');
        return [];
    }
}
const saveFavorites=(movieIds:number[])=>{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(movieIds));
}

export const addFavorite=(movieId:number)=>{
    const favorites=getFavorites();
    saveFavorites([...favorites,movieId]);
}
export const removeFavorite=(movieId:number)=>{
    const favorites=getFavorites();
    saveFavorites(favorites.filter(id=>id!=movieId));
}
export const isFavorite=(movieId:number):boolean=>{
    const favorites=getFavorites();
    return favorites.some(id=>id===movieId);
}