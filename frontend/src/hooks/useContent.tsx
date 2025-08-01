import { useEffect, useState } from "react";
import { BACKEND_URL } from "../Pages/config";
import axios from "axios";

export function useContent(){
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function Refresh(){
        const token = localStorage.getItem("token");
        console.log("Fetching content with token:", token ? "Token exists" : "No token");
        
        if (!token) {
            console.error("No token found in localStorage");
            setError("No authentication token found. Please sign in again.");
            return;
        }
        
        setLoading(true);
        setError("");
        
         axios.get(`${BACKEND_URL}/api/v1/content`,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
         })
        .then((res)=>{
            console.log("Content response:", res.data);
            setContents(res.data.content || []);
            setError("");
        })
        .catch((error) => {
            console.error("Error fetching content:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            setError(error.response?.data?.message || "Failed to fetch content");
            setContents([]);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    useEffect(()=>{
        Refresh()
        let interval = setInterval(()=>{
            Refresh();
        },10 * 1000)

        return () =>{
            clearInterval(interval);
        }
    },[])

    return {contents, Refresh, loading, error};
}