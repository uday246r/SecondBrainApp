import axios from "axios";
import { DeleteIcon } from "../icons/DeleteIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { 
    TwitterContent, 
    YouTubeContent, 
    StackOverflowContent, 
    GitHubContent, 
    MediumContent, 
    RedditContent, 
    LinkedInContent, 
    GenericContent 
} from "./ContentFetchers";
import { BACKEND_URL } from "../Pages/config";

interface CardProps{
    title: string;
    link: string;
    type: "twitter" | "youtube" | "stackoverflow" | "github" | "medium" | "reddit" | "other";
    onClick?: () => void;
}

export function Card({title, link, type, onClick}: CardProps){

    async function handleDelete(){
        // axios.delete(`${BACKEND_URL}/api/v1/brain/content`)
        const response = await axios.get(`${BACKEND_URL}/api/v1/content`,{
            
                headers: {
                    "Authorization" : `Bearer ${localStorage.getItem("token")}`
                }
        })
        //@ts-ignore
        const contentId = response.data.content[0]._id;

        const deleteContent = await axios.get(`${BACKEND_URL}/api/v1/content/${contentId}`,{
             headers: {
                    "Authorization" : `Bearer ${localStorage.getItem("token")}`
                }
        })
        console.log("ok: ",deleteContent);
    }
    return <div>
    <div className=" p-4 bg-white border-gray-200 rounded-md shadow-md outline-slate-200 max-w-72 border min-h-48 min-w-72">
        <div className="flex justify-between">
            <div className="flex items-center text-md">
                <div className="text-gray-500">
                    <ShareIcon />
                </div>
                {title}
            </div>
            <div className="flex items-center">
                <div className="pr-2 text-gray-500">
                    <a href={link} target="_blank" rel="noopener noreferrer">
                    <ShareIcon />
                    </a>
                </div>
                <div className="text-gray-500" onClick={handleDelete}>
                     <DeleteIcon />
                </div>
            </div>
        </div>
        <div className="pt-4">
            {type === 'youtube' && (
                <YouTubeContent link={link} title={title} />
            )}

            {type === 'twitter' && (
                <TwitterContent link={link} title={title} />
            )}

            {type === 'stackoverflow' && (
                <StackOverflowContent link={link} title={title} />
            )}

            {type === 'github' && (
                <GitHubContent link={link} title={title} />
            )}

            {type === 'medium' && (
                <MediumContent link={link} title={title} />
            )}

            {type === 'reddit' && (
                <RedditContent link={link} title={title} />
            )}

            {type === 'other' && link.includes('linkedin.com') && (
                <LinkedInContent link={link} title={title} />
            )}

            {type === 'other' && !link.includes('linkedin.com') && (
                <GenericContent link={link} title={title} />
            )}
        </div>
    </div>
    </div>
}