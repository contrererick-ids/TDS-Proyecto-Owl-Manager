import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      
      {/* Auth views */}
      <Route path="/auth/login" element={<Login />} />
      
    </Routes>
  </BrowserRouter>
);

export default App;