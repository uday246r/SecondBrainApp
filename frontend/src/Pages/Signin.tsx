import { useRef } from "react";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Sigin(){
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function signin(){
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
                username,
                password,
        });
        const jwt = response.data.token;
        localStorage.setItem("token",jwt);
        navigate("/dashboard");
    }
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input ref={usernameRef} placeholder="Username" />
            <Input ref={passwordRef} placeholder="Password" />
            <div className="flex justify-center pt-4">
            <Button onClick ={signin} variant="primary" text="Signin" fullWidth={true} loading={false}/>
            </div>
        </div>
    </div>
}