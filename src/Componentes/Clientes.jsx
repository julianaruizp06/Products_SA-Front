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
import { AiFillDelete, AiOutlineUserAdd, AiOutlineHome } from "react-icons/ai";

import notify from "../utils/notify";
import { useNavigate } from "react-router-dom";

const USER = {
  idusuario: "",
  nombre: "",
  tipo_documento: "",
  num_documento: "",
  direccion: "",
  telefono: "",
  email: "",
  estado: "",
};

const Cliente = (props) => {
  const url = "http://localhost:3001/cliente";

  //para listar los clientes
  const [cliente, setCliente] = useState([]); //generar la lista usuarios
  const [selected, setSelected] = useState(USER); //editar usuario
  const [clienfil, setClienfil] = useState([]); // filtra usuario

  //funcion para ver la lista de clientes
  const listarCliente = async () => {
    try {
      const res = await axios.get(url);
      if (res) {
        setCliente(res.data || []);
      }
    } catch (error) {
      console.error(error);
    }
   
  };

  useEffect(() => {
    listarCliente();
  }, []);

  //crear clientes y editar
  //capturo los datos del formulario y los guardo
  const handleInputChange = ({ target }) => {
    setSelected({
      ...selected,
      [target.name]: target.value,
    });
  };

  //verifico que los campos del formulario esten todos llenos
  const handleSubmit = async (e) => {

    try {
      e.preventDefault();
    if (!e.target.checkValidity()) {
    } else {
      let res = await axios.post(url, selected);
      if (res) {
        setModal(!modal);
        listarCliente();
      }
    }
    } catch (error) {
      console.error(error);
    }
    
  };

  //ACTUALIZAR  CLIENTES

  const actualizarCliente = async () => {
    try {
      const res = await axios.put(url, selected);

    if (res) {
      notify();
      setSelected({});
      setModaledit(!modaledit);
      listarCliente();
    }
    } catch (error) {
      console.error(error);
    }
    
  };

  //ELIMIANR CLIENTE
  const eliminarCliente = async (id) => {
    try {
      const res = await axios.delete(`${url}/${id}`);
    if (res) {
      notify();
      listarCliente();
    }
      
    } catch (error) {
      console.error(error);
    }
    
  };

  //Buscar CLIENTE
  const searchUser = ({ target }) => {
    const resultSearch = cliente.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(target.value.toLowerCase())
    );
    //Si en la input de buscar no hay datos, cargo la tabla de cliente
    setClienfil(target.value ? resultSearch : cliente);
  };

  const navigate = useNavigate();

  function atras() {
    if (props.user.rol === 1) {
      navigate("/homea");
    } else {
      navigate("/homeu");
    }
  }

  useEffect(() => {
    setClienfil(cliente);
    //eliminar el input de de search
    /* document.getElementById (search)=none */
  }, [cliente]);

  //ventana modal

  const [modal, setModal] = useState(false); //crear cliente
  const [modaledit, setModaledit] = useState(false); //editar cliente

  const toggle = () => setModal(!modal);

  const toggleedit = (user) => {
    setSelected(user);
    setModaledit(!modaledit);
  };

  return (
    <div className="container-sm">
      <header
        className="header_u"
        style={{ color: "white", marginTop: 40, marginBottom: 40 }}
      >
        <h2>Bienvenido:{props.user.name} </h2>
        <p>
          <h5>
            En este módulo puedes agregar, editar y eliminar los diferentes
            clientes del sistema.{" "}
          </h5>
        </p>

        <div className="agregarUsuario">
          <Button id="home" className="btn btn-light " onClick={atras}>
            <AiOutlineHome />
            Inicio
          </Button>
        </div>
        <div id="agregU">
          <input
            type="searchclien"
            id="searchC"
            onChange={searchUser}
            placeholder=" ¿ Qué cliente buscas ?"
          />
          <Button
            id="btn_agregar"
            className="btn btn-success"
            onClick={() => toggle()}
          >
            <AiOutlineUserAdd /> Agregar cliente
          </Button>
        </div>
      </header>

      <table className="table" id="table" style={{ background: "white" }}>
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th className="text-center">Nombre</th>
            <th className="text-center">Teléfono</th>
            <th className="text-center">Dirección</th>
            <th className="text-center">Email</th>
            <th className="text-center"></th>
            <th className="text-center"></th>
          </tr>
        </thead>

        <tbody>
          {clienfil.map((item, key) => (
            <tr key={key}>
              <td key={key} className="text-center">
                {key + 1}{" "}
              </td>
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
                  onClick={() => eliminarCliente(item.idcliente)}
                >
                  <AiFillDelete />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Agregar Nuevo Cliente</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <Form
                onSubmit={handleSubmit}
                className="needs-validation"
                noValidate={true}
                autoComplete="off"
              >
                <br />
                <label htmlFor="nombre">
                  <strong>Nombre</strong>
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="nombre"
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
                    type="text"
                    name="num_documento"
                    id="num_documento"
                    onChange={handleInputChange}
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
                />
                <br />
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
                <br />
                <label htmlFor="email">
                  <strong>Email</strong>
                </label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
                <br />
                <div className="col-md-12">
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
        <ModalHeader toggle={toggleedit}>Editar Cliente</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <Form
              onSubmit
              className="needs-validation"
              noValidate={true}
              autoComplete="off"
            >
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
                  type="text"
                  name="num_documento"
                  id="num_documento"
                  onChange={handleInputChange}
                  value={selected.num_documento}
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
              />
              <br />
              <label htmlFor="telefono">
                <strong>Telefono</strong>
              </label>
              <input
                className="form-control"
                type="text"
                name="telefono"
                id="telefono"
                onChange={handleInputChange}
                value={selected.telefono}
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
            onClick={() => actualizarCliente()}
          >
            Guardar
          </Button>

          <Button color="secondary" onClick={() => toggleedit(!modaledit)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Cliente;
