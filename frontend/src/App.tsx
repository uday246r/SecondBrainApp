import Dashboard from "./Pages/dashboard"
import { Signup } from "./Pages/Signup"
import { Signin } from "./Pages/Signin"
import { BrowserRouter, Routes, Route} from "react-router-dom"

function App(){
return <BrowserRouter>
<Routes>
    <Route path="/signup" element={<Signup />} />
    <Route path="/signin" element={<Signin />} />
    <Route path="/dashboard" element={<Dashboard />} />
</Routes>
</BrowserRouter>
}

export default App