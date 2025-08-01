import Dashboard from "./Pages/dashboard"
import { Sigin } from "./Pages/Signin"
import { Signup } from "./Pages/Signup"
import { SharePage } from "./Pages/SharePage"
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"

function App(){
return <BrowserRouter>
<Routes>
    <Route path="/" element={<Navigate to="/signin" replace />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/signin" element={<Sigin/>} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/share/:hash" element={<SharePage />} />
</Routes>
</BrowserRouter>
}

export default App