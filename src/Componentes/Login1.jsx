import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setLocalStorage, types } from "../utils/localStorage";
import alert from "../utils/alert";
import datosinco from "../utils/datosinco";

function Login(props) {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ usuario: "", contrasenia: "" });

  //lo que hace esta funcion es asignarle a la variable datos, todo lo que cambie en datos sera reflejado en la vista
  const handleInputChange = (e) => {
    let { name, value } = e.target;
    let newDatos = { ...datos, [name]: value };
    setDatos(newDatos);
  };

  //me maneja el envio del formularop asyn , lo detengo y en la codicion valido el los datos que no deje loe espacios en blanco, utilizo el axios
  // y por medio del post lo envio a "http://localhost:3001/usuario/login"

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {

      alert();
    } else {
      let res = await axios.post("http://localhost:3001/login", datos);
      if (res.data.respuesta === false) {
        datosinco();
      }

      const data = res.data;
      const user = {
        name: data.nDatos.userId,
        pass: data.nDatos.contrasenia,
        id: data.nDatos.id,
        rol: data.idrol,
      };

      props.setUser(user);
      setLocalStorage(types.USER, user);

      if (res.data.respuesta === true) {
        localStorage.setItem("tokenjwt", res.data.nDatos.token);
        if (res.data.idrol === 1) {
          navigate("/homea");
        } else {
          navigate("/homeu");
        }
      }
    }
  };

return(
  <div className="containerlogin">

    <div className="headerlogin" >

        <div  className="imagen">
        <section className="img"> </section>
       </div>
    
       

     </div>
  

      

<div  className="login-page">

  <div  className="form" 

  
  >
     
 
    <form  
    id="form_login"
    onSubmit={handleSubmit}
        className="needs-validation"
        noValidate={true}
        autoComplete="off"
        >
           <div className=""> 
        <p>Iniciar sesion </p>
        </div>
    
 
      <input
       id="password"
       type="text"
       placeholder="Usuario"
       onChange={handleInputChange}
       defaultValue={datos.usuario}
       className="inputlogin"
       name="usuario"
       autoFocus
       required   
     />

      <input 
      id="password"
      type="password"
      placeholder="Contraseña"
      onChange={handleInputChange}
      defaultValue={datos.contrasenia}
      className="inputlogin"
      name="contrasenia"
      autoFocus
      required  />

      <button
            type="submit">           
        Ingresar</button>
      <p  className="message">No resgistrado? <a href="#">Crear una cuenta</a></p>
    </form>
  </div>
</div>
</div>


)
}

export default Login;
