import { CreateMoviePage } from "@/components/CreateMoviePage";
import { getData, getDirectors } from "@/lib/movies";

export default async function CreateMovie(){
    //handle error state
    const [genres, directors]=await Promise.all([getData('genres'),getDirectors()]);
    return (
        <div>
            <CreateMoviePage genres={genres} directors={directors}/>
        </div>
    )
}