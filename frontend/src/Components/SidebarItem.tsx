import type { ReactElement } from "react";

export function SlidebarItem({text, icon, onClick, isActive}:{
    text: string;
    icon: ReactElement;
    onClick: ()=> void;
    isActive?: boolean;
}){
    return <div 
             onClick={onClick}
             className={`flex text-gray-700 py-2 cursor-pointer hover:bg-gray-200 rounded max-w-48 pl-4 ${isActive ? 'bg-gray-300 font-semibold' : 'hover:bg-gray-200'}`}>
        <div className="pr-2 transition-150">
            {icon}
        </div>
        <div>
            {text}
        </div>
    </div>
}