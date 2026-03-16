import { SortSelectProp } from "@/types/movies";


export function SortSelect({onSort}:SortSelectProp){
    
    return (
        <select onChange={(e)=>onSort(e.target.value)}>
            <option value={''}>Sort by</option>
            <option value={'A-Z'}>A-Z</option>
            <option value={'high-low'}>Rating</option>
            <option value={'newest-first'}>Year</option>
        </select>
    )
}