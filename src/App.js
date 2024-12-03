import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MyNavbar from './Components/MyNavBar';
import Home from './Components/Home';
import FormRegister from './Components/FormRegister';
import FormLogin from './Components/FormLogin';
import "bootstrap/dist/css/bootstrap.min.css";
import ProfiloUtente from './Components/ProfiloUtente';
import ProtectedRoute from './Components/ProtectedRoute'; 

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/register" element={<FormRegister />} />
        <Route path="/login" element={<FormLogin />} />
        <Route
          path="/profilo"
          element={
            <ProtectedRoute>
              <ProfiloUtente />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
