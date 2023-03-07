import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from "reactstrap";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete, AiOutlineUserAdd } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import { setLocalStorage, types } from "../utils/localStorage";

import notify from "../utils/notify";

const USER = {
  idrol: "",
  nombre: "",
  tipo_documento: "",
  num_documento: "",
  direccion: "",
  telefono: "",
  email: "",
  estado: "",
};

const log = {
  idusuario: "",
  idrol: "",
  usuario: "",
  contrasenia: "",
};

const Usuario = (props) => {
  const url = "http://localhost:3001/usuario";
  const urlLogin = " http://localhost:3001/login/crear";

  //para listar los ususarios
  const [usuario, setUsuario] = useState([]); //generar la lista usuarios
  const [selected, setSelected] = useState(USER); //editar usuario
  const [usufil, setUsufil] = useState([]); // filtra usuario
  const [login, setLogin] = useState([log]);

  //funcion para ver la lista de usuarios
  const listarUsuario = async () => {
    const res = await axios.get(url);
    if (res) {
      setUsuario(res.data || []);
    }
  };

  useEffect(() => {
    listarUsuario();
  }, []);

  //crear usuario y editar
  //capturo los datos del formulario y los guardo
  const handleInputChange = ({ target }) => {
    setSelected({
      ...selected,
      [target.name]: target.value,
    });
  };

  //verifico que los campos del formulario esten todos llenos
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
    } else {
      let res = await axios.post(url, selected);
      if (res) {
        listarUsuario();
        setModal(!modal);
      }
    }
  };

  const crearLogin = async () => {
    const res = await axios.post(urlLogin, selected);

    if (res) {
      notify();
      setSelected({});
      setModalLogin(!modalogin);
      listarUsuario();
    }
  };

  //ACTUALIZAR  USUARIO

  const actualizarUsuario = async () => {
    const res = await axios.put(url, selected);

    if (res) {
      listarUsuario();
      notify();
      setLogin();
      setSelected({});
      setModaledit(!modaledit);
    }
  };

  //ELIMIANR USUARIO
  const eliminarUsuario = async (id) => {
    const res = await axios.delete(`${url}/${id}`);
    if (res) {
      notify();
      listarUsuario();
    }
  };

  //Buscar Usuario
  const searchUser = ({ target }) => {
    const resultSearch = usuario.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(target.value.toLowerCase())
    );
    //Si en la input de buscar no hay datos, cargo la tabla de usuario
    setUsufil(target.value ? resultSearch : usuario);
  };

  useEffect(() => {
    setUsufil(login);
    //eliminar el input de de search
    /* document.getElementById (search)=none */
  }, [login]);

  useEffect(() => {
    setUsufil(usuario);
    //eliminar el input de de search
    /* document.getElementById (search)=none */
  }, [usuario]);

  //ventana modal

  const [modal, setModal] = useState(false); //crear usuario
  const [modaledit, setModaledit] = useState(false); //editar usuario
  const [modalogin, setModalLogin] = useState(false); //editar usuario

  const toggle = () => setModal(!modal); //de la modal agregar usuario

  const toggleedit = (user) => {
    // de la modal editar
    setSelected(user);
    setModaledit(!modaledit);
  };

  const toggleelogin = (login) => {
    //de la modal login
    setSelected(login);
    setModalLogin(!modalogin);
  };

  const [user, setUser] = React.useState("");

  const getUser = () => {
    const user = localStorage.getItem("USER");
    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, [user]);

  const navigate = useNavigate();

  function atras() {
    navigate("/homea");
  }

  /* 
    function atras() {
      navigate("/homea")  
   
    }
     */

  return (
    <div className="container-sm">
      <header
        className="header_u"
        style={{ color: "white", marginTop: 40, marginBottom: 40 }}
      >
        <div className="titulousuario">
          <h2>Bienvenido: {props.user.name} </h2>
        </div>
        <p>
          <h5>
            En este módulo puedes agregar, editar y eliminar los diferentes
            usuarios del sistema.{" "}
          </h5>
        </p>

        <div className="agregarUsuario">
          <Button id="home" className="btn btn-light " onClick={atras}>
            {" "}
            Inicio
          </Button>
        </div>

        <div id="agregU">
          <input
            type="search"
            id="searchU"
            onChange={searchUser}
            placeholder=" ¿Qué usuario buscas?"
          />
          <Button
            id="btn_agregar"
            className="btn btn-success"
            onClick={() => toggle()}
          >
            <AiOutlineUserAdd /> Agregar usuario
          </Button>
        </div>
      </header>

      <table
        className="table table-hover"
        id="table"
        style={{ background: "white" }}
      >
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th className="text-center">Rol</th>
            <th className="text-center">Nombre</th>
            <th className="text-center">Teléfono</th>
            <th className="text-center">Dirección</th>
            <th className="text-center">Email</th>
            <th className="text-center"></th>
            <th className="text-center"></th>
            <th className="text-center"></th>
          </tr>
        </thead>
        <tbody>
          {usufil.map((item, key) => (
            <tr key={key}>
              <td key={key} className="text-center">
                {key + 1}{" "}
              </td>
              <td className="text-center">{item.nombre_rol} </td>
              <td className="text-center">{item.nombre}</td>
              <td className="text-center">{item.telefono}</td>
              <td className="text-center">{item.direccion}</td>
              <td className="text-center">{item.email}</td>
              <td>
                <Button
                  className="btn btn-warning"
                  id="editar"
                  onClick={() => toggleedit(item)}
                >
                  <FaEdit />
                </Button>
              </td>
              <td>
                <Button
                  className="btn btn-danger"
                  id="eliminar"
                  onClick={() => eliminarUsuario(item.idusuario)}
                >
                  <AiFillDelete />
                </Button>
              </td>
              <td>
                <Button
                  className="btn btn-success"
                  id="eliminar"
                  onClick={() => toggleelogin(item)}
                >
                  login
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Agregar Nuevo Usuario</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <Form
                onSubmit={handleSubmit}
                className="needs-validation"
                noValidate={true}
                autoComplete="off"
              >
                <div className="col-md-4">
                  <div id="oplogin" className="idrol">
                    <label>
                      <strong> Rol</strong>
                    </label>
                    <select
                      className="idrol"
                      name="idrol"
                      id="idrol"
                      onChange={handleInputChange}
                    >
                      <option selected disabled value="">
                        -- Seleccione --
                      </option>
                      <option value="1">Administrador</option>
                      <option value="2">Usuario</option>
                    </select>
                  </div>
                </div>
                <br />
                <div id="oplogin" className="nombre">
                  <label htmlFor="nombre">
                    <strong>Nombre</strong>
                  </label>
                  <input
                    className="form-control"
                    pattern="[A-Z]"
                    type="text"
                    name="nombre"
                    id="nombre"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <br />

                <div className="col-md-12">
                  <div id="oplogin" className="tipo_documento">
                    <label>
                      <strong> Tipo de identificación</strong>
                    </label>
                    <select
                      className="form-control"
                      name="tipo_documento"
                      id="tipo_documento"
                      onChange={handleInputChange}
                    >
                      <option selected disabled value="">
                        -- Seleccione --
                      </option>
                      <option value="cedula_de_ciudadania">
                        Cédula de ciudadanía
                      </option>
                      <option value="Tarjeta_identidad">
                        Tarjeta de identidad
                      </option>
                      <option value="Nit">NIT</option>
                    </select>
                  </div>
                </div>
                <br />

                <div className="col-md-12">
                  <div id="oplogin" className="numero_documento">
                    <label htmlFor="numero_documento">
                      <strong>Número de documento</strong>
                    </label>
                    <input
                      pattern="[0-9]"
                      maxlength="10"
                      className="form-control"
                      type="number"
                      name="num_documento"
                      id="num_documento"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <br />

                <div className="col-md-12">
                  <div id="oplogin" className="direccion">
                    <label htmlFor="direccion">
                      <strong>Direccion</strong>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="direccion"
                      id="direccion"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <br />

                <div className="col-md-12">
                  <div id="oplogin" className="telefono">
                    <label htmlFor="telefono">
                      <strong>Telefono</strong>
                    </label>

                    <input
                      className="form-control"
                      type="text"
                      name="telefono"
                      id="telefono"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <br />
                <div className="col-md-12">
                  <div id="oplogin" className="email">
                    <label htmlFor="email">
                      <strong>Email</strong>
                    </label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="usuario@ejemplo.com"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <br />

                <div className="col-md-12">
                  <div id="oplogin" className="estado">
                    <label htmlFor="estado">
                      <strong> Estado</strong>
                    </label>
                    <select
                      className="form-control"
                      name="estado"
                      id="estado"
                      onChange={handleInputChange}
                    >
                      <option selected disabled value="">
                        -- Seleccione --
                      </option>
                      <option value="1">Activo</option>
                      <option value="2">Inactivo</option>
                    </select>
                  </div>
                </div>
              </Form>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" onClick={handleSubmit}>
              Crear
            </Button>

            <Button color="secondary" onClick={toggle}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      {/* Modal editar */}

      <Modal isOpen={modaledit} id="editar" toggle={toggleedit}>
        <ModalHeader toggle={toggleedit}>Editar Usuario</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <Form
              onSubmit
              className="needs-validation"
              noValidate={true}
              autoComplete="off"
            >
              <div className="col-md-4">
                <label>
                  <strong> Rol</strong>
                </label>
                <select
                  className="form-control"
                  name="idrol"
                  id="idrol"
                  onChange={handleInputChange}
                  value={selected.idrol}
                >
                  <option selected disabled value="">
                    -- Seleccione --
                  </option>
                  <option value="1">Administrador</option>
                  <option value="2">Usuario</option>
                </select>
              </div>
              <br />
              <label htmlFor="nombre">
                <strong>Nombre</strong>
              </label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                value={selected.nombre}
                id="nombre"
                onChange={handleInputChange}
              />
              <br />
              <div className="col-md-12">
                <label htmlFor="">
                  <strong> Tipo de identificación</strong>
                </label>
                <select
                  className="form-control"
                  name="tipo_documento"
                  id="tipo_documento"
                  onChange={handleInputChange}
                  value={selected.tipo_documento}
                >
                  <option selected disabled value="">
                    -- Seleccione --
                  </option>
                  <option value="cedula_de_ciudadania">
                    Cédula de ciudadanía
                  </option>
                  <option value="Tarjeta_identidad">
                    Tarjeta de identidad
                  </option>
                  <option value="Nit">NIT</option>
                </select>
              </div>
              <div className="col-md-12">
                <label htmlFor="numero_documento">
                  <strong>Numero de documento</strong>
                </label>
                <input
                  className="form-control"
                  type="number"
                  name="num_documento"
                  id="num_documento"
                  onChange={handleInputChange}
                  value={selected.num_documento}
                  required
                />
              </div>
              <label htmlFor="direccion">
                <strong>Direccion</strong>
              </label>
              <input
                className="form-control"
                type="text"
                name="direccion"
                id="direccion"
                onChange={handleInputChange}
                value={selected.direccion}
                required
              />
              <br />
              <label htmlFor="telefono">
                <strong>Telefono</strong>
              </label>
              <input
                className="form-control"
                type="number"
                name="telefono"
                id="telefono"
                onChange={handleInputChange}
                value={selected.telefono}
                required
              />
              <br />
              <label htmlFor="emaill">
                <strong>Email</strong>
              </label>
              <input
                className="form-control"
                type="text"
                name="email"
                id="email"
                onChange={handleInputChange}
                value={selected.email}
              />
              <br />
              <div className="col-md-12">
                <label htmlFor="">
                  <strong> Estado</strong>
                </label>
                <select
                  className="form-control"
                  name="estado"
                  id="estado"
                  onChange={handleInputChange}
                  value={selected.estado}
                >
                  <option selected disabled value="">
                    -- Seleccione --
                  </option>
                  <option value="1">Activo</option>
                  <option value="2">Inactivo</option>
                </select>
              </div>
            </Form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            type="submit"
            onClick={() => actualizarUsuario()}
          >
            Guardar
          </Button>

          <Button color="secondary" onClick={() => toggleedit(!modaledit)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      {/* modal login */}
      <div>
        <Modal isOpen={modalogin} id="editar" toggle={toggleelogin}>
          <ModalHeader toggle={toggleelogin}>Login</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <Form
                onSubmit
                className="needs-validation"
                noValidate={true}
                autoComplete="off"
              >
                <div className="col-md-4">
                  <label>
                    <strong> Rol</strong>
                  </label>
                  <th className="text-center">{selected.nombre_rol} </th>
                </div>

                <div className="col-md-12">
                  <label htmlFor="usuario">
                    <strong>Nickname</strong>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="usuario"
                    id="usuario"
                    onChange={handleInputChange}
                    value={selected.usuario}
                  />
                </div>
                <label htmlFor="contrasenia">
                  <strong>Contraseña</strong>
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="contrasenia"
                  id="contrasenia"
                  onChange={handleInputChange}
                  value={selected.contrasenia}
                />
                <br />
              </Form>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              type="submit"
              onClick={() => crearLogin(selected)}
            >
              Guardar
            </Button>

            <Button color="secondary" onClick={() => toggleelogin(!modalogin)}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default Usuario;
