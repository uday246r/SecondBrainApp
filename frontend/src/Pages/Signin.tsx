import { Button } from "../Components/Button";
import { Input } from "../Components/Input";

export function Signin(){
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input placeholder="Username" />
            <Input placeholder="Username" />
            <div className="flex justify-center pt-4">
            <Button variant="primary" text="Signin" fullWidth={true} loading={false}/>
            </div>
        </div>
    </div>
}