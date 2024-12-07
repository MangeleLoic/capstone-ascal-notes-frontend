import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MyNavbar from './Components/MyNavBar';
import Home from './Components/Home';
import FormRegister from './Components/FormRegister';
import FormLogin from './Components/FormLogin';
import "bootstrap/dist/css/bootstrap.min.css";
import ProfiloUtente from './Components/ProfiloUtente';
import ProtectedRoute from './Components/ProtectedRoute'; 
import MyFooter from './Components/MyFooter';
import NotFound from './Components/NotFound';
import Corsi from './Components/Corsi';
import GestisciCorsi from './Components/GestisciCorsi';
import AggiungiCorso from './Components/AggiungiCorso';
import ModificaCorso from './Components/ModificaCorsi';

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/register" element={<FormRegister />} />
        <Route path="/login" element={<FormLogin />} />
        <Route path="/admin" element={<GestisciCorsi />} />
        <Route path="/admin/corso/aggiungi" element={<AggiungiCorso />} />
        <Route path="/admin/corso/modifica/:id" element={<ModificaCorso />} />
        <Route path="/corsi" element={<Corsi />} />
        <Route path='*' element={<NotFound />} />
        <Route
          path="/profilo"
          element={
            <ProtectedRoute>
              <ProfiloUtente />
            </ProtectedRoute>
          }
        />
      </Routes>
      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
