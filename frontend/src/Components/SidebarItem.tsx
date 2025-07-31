import type { ReactElement } from "react";

export function SlidebarItem({text, icon}:{
    text: string;
    icon: ReactElement;
}){
    return <div className="flex text-gray-700 py-2 cursor-pointer hover:bg-gray-200 rounded max-w-48 pl-4">
        <div className="pr-2 transition-150">
            {icon}
        </div>
        <div>
            {text}
        </div>
    </div>
}