import { SearchBarProp } from "@/types/movies";
import React from "react";

export function SearcBar({onSearch}:SearchBarProp){
    return(
        <div className="m-10">
            <input type="text" placeholder="Enter Movie Title" onChange={(e)=>onSearch(e.target.value)}/>
        </div>
    )
}