import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/Twitter";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SlidebarItem } from "./SidebarItem";

interface SideBarProps{
onFilterClick : (type: string | null)=>void;
selectedType: string | null;
}

export function Sidebar({onFilterClick, selectedType}: SideBarProps){
    return <div className="h-screen bg-white border-r w-72 fixed left-0 top-0 pl-6">
        <div className="flex text-2xl pt-8 items-center">
            <div className="pr-2 text-purple-600">
                <Logo />
                </div>
            Brainly
        </div>
        <div className="pt-8 pl-6">
            <div className="flex flex-col space-y-2">
            <SlidebarItem text ="Twitter" icon={<TwitterIcon />} onClick={()=>onFilterClick("twitter")} isActive={selectedType === "twitter"}/>
            <SlidebarItem text ="Youtube" icon={<YoutubeIcon />} onClick={()=>onFilterClick("youtube")} isActive={selectedType === "youtube"}/>
           <SlidebarItem text ="Others" icon={
    <span className="flex flex-col justify-center items-center">
      <img
        src="data:image/png;base64,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"
        alt="Others"
        className="w-5 h-5 mt-1"
      />
    </span>
  } onClick={()=>onFilterClick("other")} isActive={selectedType === "other"}/>
            <SlidebarItem text="All" icon={<span>🌐</span>} onClick={()=> onFilterClick(null)} isActive={selectedType === null}/>
        </div>
        </div>
    </div>
}