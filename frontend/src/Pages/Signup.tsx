import { useRef } from "react";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signup(){
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();


    async function signup(){
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const firstName = firstNameRef.current?.value;
        
        if (!username || !password || !firstName) {
            alert("Please fill in all fields");
            return;
        }
        
        try {
            await axios.post(`${BACKEND_URL}/api/v1/signup`,{
                    username,
                    password,
                    firstName
            });
            alert("You have signed up!")
            navigate("/signin");
        } catch (error: any) {
            console.error("Signup error:", error);
            if (error.response?.data?.message) {
                alert(`Signup failed: ${error.response.data.message}`);
            } else {
                alert("Signup failed. Please try again.");
            }
        }
    }
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input ref={usernameRef} placeholder="Username" />
            <Input ref={passwordRef} placeholder="Password" />
            <Input ref={firstNameRef} placeholder="First Name" />
            <div className="flex justify-center pt-4">
            <Button onClick ={signup} variant="primary" text="Signup" fullWidth={true} loading={false}/>
            </div>
        </div>
    </div>
}