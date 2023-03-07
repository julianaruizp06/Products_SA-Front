import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login1 from './Componentes/Login1';
import Dashboard from './Componentes/Dashboard';
import Clientes from './Componentes/Clientes';
import Usuarios from './Componentes/Usuarios';
import Articulos from './Componentes/Articulos';
import Cotizaciones from './Componentes/Cotizaciones';
import DashboardUsu from './Componentes/DashboardUsu';
import './App.css';
import { getLocalStorage, types } from './utils/localStorage';
import Factura from './Componentes/Factura/Factura';


const usuario = getLocalStorage(types.USER) || {};



function App() {
  const [user, setUser] = useState(usuario)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login1 setUser={setUser} />} />
          <Route exact path="/homea" element={<Dashboard user={user} />} />
          <Route exact path="/homeu" element={<DashboardUsu user={user}/>} />
          <Route exact path="/usuarios" element={<Usuarios user={user} />} />
          <Route exact path="/clientes" element={<Clientes user={user}/>} />
          <Route exact path="/articulos" element={<Articulos user={user}/>} />
          <Route exact path="/cotizaciones" element={<Cotizaciones user={user}/>} />
          <Route exact path="/factura/:id" element={<Factura user={user}/>} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
