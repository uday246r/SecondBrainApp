import Dashboard from "./Pages/dashboard"
import { Sigin } from "./Pages/Signin"
import { Signup } from "./Pages/Signup"
import { BrowserRouter, Routes, Route} from "react-router-dom"

function App(){
return <BrowserRouter>
<Routes>
    <Route path="/signup" element={<Signup />} />
    <Route path="/signin" element={<Sigin/>} />
    <Route path="/dashboard" element={<Dashboard />} />
</Routes>
</BrowserRouter>
}

export default App