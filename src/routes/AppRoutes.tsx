import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import RegisterForm from '@/pages/Register';


function AppRoutes() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
