import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import axios from 'axios';
import { BACKEND_URL } from "../Pages/config";

const ContentType = {
        Youtube: "youtube",
        Twitter: "twitter",
        StackOverflow: "stackoverflow",
        GitHub: "github",
        Medium: "medium",
        Reddit: "reddit",
        Other: "other",
    } as const;

export function Model({open, onClose}: {open: boolean; onClose: () => void}){
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type,setType]  = useState<string>(ContentType.Youtube);

   
    async function addContent(){
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;

        if (!title || !link) {
            alert("Please fill in all fields");
            return;
        }

        // Basic URL validation
        try {
            new URL(link);
        } catch {
            alert("Please enter a valid URL");
            return;
        }

        try {
            await axios.post(`${BACKEND_URL}/api/v1/content`,{
                link,
                title,
                type
            },{
                headers: {
                    "Authorization" : `Bearer ${localStorage.getItem("token")}`
                }
            });

            onClose();
        } catch (error: any) {
            console.error("Error adding content:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            
            if (error.response?.data?.message) {
                let errorMessage = `Error: ${error.response.data.message}`;
                if (error.response.data.details) {
                    errorMessage += `\nDetails: ${JSON.stringify(error.response.data.details)}`;
                }
                if (error.response.data.error) {
                    errorMessage += `\nTechnical Error: ${error.response.data.error}`;
                }
                alert(errorMessage);
            } else {
                alert("Failed to add content. Please try again.");
            }
        }
   }
    return<div>
        {open && <div>
            <div 
        className="w-screen h-screen 
        bg-slate-500 
        fixed top-0 left-0 
        opacity-60
        flex
        justify-center"
        >
            </div>
            <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
            <div className="flex flex-col justify-center">
            <span className="bg-white opacity-100 p-4 rounded fixed">
                <div className="flex justify-end">
                    <div onClick={onClose} className="cursor-pointer">
                    <CrossIcon/>
                    </div>
                </div>
                <div>
                    <Input ref={titleRef} placeholder = {"Title"} />
                    <Input ref={linkRef} placeholder = {"Link"} />
                </div>
                <div>
                    <h1>Types</h1>
                    <div className="flex gap-1 pb-2 justify-center flex-wrap">
                        <Button text="Youtube" variant={type===ContentType.Youtube ? "primary" : "secondary"} onClick={()=>{
                            setType(ContentType.Youtube)
                        }}></Button>
                        <Button text="Twitter" variant={type===ContentType.Twitter ? "primary" : "secondary"} onClick={()=>{
                            setType(ContentType.Twitter)
                        }}></Button>
                        <Button text="Stack Overflow" variant={type===ContentType.StackOverflow ? "primary" : "secondary"} onClick={()=>{
                            setType(ContentType.StackOverflow)
                        }}></Button>
                        <Button text="GitHub" variant={type===ContentType.GitHub ? "primary" : "secondary"} onClick={()=>{
                            setType(ContentType.GitHub)
                        }}></Button>
                        <Button text="Medium" variant={type===ContentType.Medium ? "primary" : "secondary"} onClick={()=>{
                            setType(ContentType.Medium)
                        }}></Button>
                        <Button text="Reddit" variant={type===ContentType.Reddit ? "primary" : "secondary"} onClick={()=>{
                            setType(ContentType.Reddit)
                        }}></Button>
                        <Button text="Other" variant={type===ContentType.Other ? "primary" : "secondary"} onClick={()=>{
                            setType(ContentType.Other)
                        }}></Button>
                    </div>
                </div>
                <div className="flex justify-center">
                <Button onClick={addContent} variant="primary" text="Submit" />
                </div>
                </span>
                </div>
        </div>
        </div>
        }
    </div>
}

