import { LoaderCircleIcon } from "lucide-react";

export function Loader(){
    return(
        <div className="flex items-center justify-center mt-5 transition animate-spin">
            <LoaderCircleIcon size="64" />
        </div>
    )
}