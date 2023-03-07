import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input,
} from "reactstrap";
import { FaEdit } from "react-icons/fa";
import {
  AiFillDelete,
  AiOutlineUserAdd,
  AiOutlineSearch,
} from "react-icons/ai";

import notify from "../utils/notify";

import { useNavigate } from "react-router-dom";
import Edit from "./Modals/Cotizaciones/Edit";



const USER = {
  iddetalle: "",
  id_cotizacion: "",
  idarticulo: "",
  cantidad: "",
  subtotal: "",
  descuento: "",
  costo_envio: "",
  total: "",
  nombre_articulo: "",
  fecha_cotizacion: "",
  usuario_cotizacio: "",
  cliente_cotizaciones: "",
  cliente_nombre: "",
  usuario_nombre: "",
};

const Cotizacion = (props) => {
  const url = "http://localhost:3001/cotizacion";
  const [detalles_cotizacion, setdetalles_cotizacion] = useState([]); //generar la lista ventas
  const [selected, setSelected] = useState(USER); //editar cotizaciones
  const [detalles_cotizacionfil, setdetalles_cotizacionfil] = useState([]); // filtra cotizacion
  const [articulo, setArticulo] = useState([]); //generar la lista articulos
  const [cliente, setCliente] = useState([]); //generar la lista usuarios
  const [listAr, setListar] = useState([]);
  const [idCliente, setIdCliente] = useState(null);
  const [selectFactura, setSelectFactura] = useState(null);
  const navigate = useNavigate();

  //ventana modal
  const [modal, setModal] = useState(false); //crear usuario
  const [modaledit, setModaledit] = useState(false); //editar usuario
  const [editModalFactura, setEditModalFactura] = useState(false);

  //funcion para ver la lista de cotizaciones en la primera vista
  const listarCotizaciones = async () => {
    const res = await axios.get(url);

    if (res) {
      setdetalles_cotizacion(res.data || []);
    }
  };

  useEffect(() => {
    listarCotizaciones();
  }, []);

  ///funciones para agregar cotizacion

  //funcion para listar los clientes en la modal
  const listarCliente = async () => {
    const res = await axios.get("http://localhost:3001/cliente");
    if (res) {
      setCliente(res ? [{}, ...res.data] : []);
    }
  };
  useEffect(() => {
    listarCliente();
  }, []);

  //funcion para Buscar Cotizacion
  const searchUser = ({ target }) => {
    const resultSearch = detalles_cotizacion.filter((detalles_cotizacion) =>
      detalles_cotizacion.cliente
        .toLowerCase()
        .includes(target.value.toLowerCase())
    );
    //Si en la input de buscar no hay datos, cargo la tabla de usuario
    setdetalles_cotizacionfil(
      target.value ? resultSearch : detalles_cotizacion
    );
  };

  useEffect(() => {
    if (detalles_cotizacionfil) {
      setdetalles_cotizacionfil(detalles_cotizacion);
    }
  }, [detalles_cotizacion]);

  //funcion para ver la lista de articulos de la tabla modal
  const listarArticulo = async () => {
    const res = await axios.get("http://localhost:3001/articulo");
    if (res) {
      setArticulo([{}, ...res.data] || []);
    }
  };
  useEffect(() => {
    listarArticulo();
  }, []);

  //abrir ventana modal que crea la cotizacion
  const toggle = () => {
    setModal(!modal);
    listarArticulo();
    listarCliente();
  };

  //ver una factura
  const hanldeView = (id) => {
    navigate(`/factura/${id}`);
  };

  //funciones para agregar los articulos en la ventana modal
  //agrgar una fila
  const agreArt = () => {
    setListar([...listAr, { id: listAr.length + 1 }]);
  };

  //crear articulo y editar
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
      const precios = listAr.map((x) => x.precioT); //calcular la su total de los articulos
      const valor = precios.reduce((cont, next) => cont + next);
      const descuento = setDescuento(selected.descuento);
      const valorDes = valor - valor * (descuento / 100); //valor del total con descuento
      const costo_envio = setCosto_envio(selected.costo_envio);
      const total_pagar = valorDes + costo_envio; //valorfinal a pagar

      const payload = {
        idusuario: props.user.id,
        idcliente: Number(idCliente),
        valor: valor,
        articulos: listAr,
        descuento: descuento,
        valorDes,
        costo_envio,
        total_pagar,
      };

      let res = await axios.post(url, payload);
      if (res) {
        notify();
        listarCotizaciones();
        setModal(!modal);
        setListar([]);
      }
    }
  };

  const setDescuento = (valor) => {
    const valorDescuento = {
      1: 20,
      2: 30,
      3: 50,
    };
    return valorDescuento[valor];
  };

  const setCosto_envio = (valor) => {
    const Costo_envio = {
      1: 5000,
      2: 6000,
      3: 7000,
    };
    return Costo_envio[valor];
  };

  //eliminar cotizacion

  const dropCotizacion = async (id) => {
    try {
      const res = await axios.delete(`${url}/${id}`);
      if (res) {
        notify();
        listarCotizaciones();
      }
    } catch (error) {
      console.error(error);
    }
   
  };

  //ELIMINAR FILAS DE LA TABLA  AGREGAR ARTICULOS
  const eliminarLisArt = (id) => {
    setListar(listAr.filter((item) => item.id !== id));
  };

  const toggleedit = (user) => {
    setSelected(user);
    setModaledit(!modaledit);
  };

  //funcion  para identificar el precio del articulo

  const changeArt = (e, id) => {
    const idArticulo = e.target.value;
    let lista = [];
    if (idArticulo) {
      const product = articulo.find((art) => art.idarticulo == idArticulo);
      lista = listAr.map((item) =>
        item.id === id
          ? { ...item, precioU: Number(product.precio_venta), idArticulo }
          : item
      );
    } else {
      lista = listAr.map((item) =>
        item.id === id ? { ...item, precioU: "", precioT: "" } : item
      );
    }
    setListar(lista);
  };
  ///vemos la cantidad que se digita
  const changeCant = (e, id) => {
    const cant = e.target.value;
    const lista = listAr.map((item) =>
      item.id === id
        ? {
            ...item,
            cant: Number(cant),
            precioT: Number(cant) * item.precioU
          }
        : item
    );
    setListar(lista);
  };

  //funcion atras

  function atras() {
    if (props.user.rol === 1) {
      navigate("/homea");
    } else {
      navigate("/homeu");
    }
  }

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
            cotizaciones del sistema.{" "}
          </h5>{" "}
        </p>

        <div className="agregarA">
          <Button id="home" className="btn btn-light " onClick={() => atras()}>
            Inicio
          </Button>
        </div>

        <div id="agregU">
          <input
            type="search"
            id="searchco"
            onChange={searchUser}
            placeholder=" ¿ Qué cotización buscas ?"
          />
          <Button
            id="btn_agregar"
            className="btn btn-success"
            onClick={() => toggle()}
          >
            {" "}
            <AiOutlineUserAdd /> Agregar Cotización
          </Button>
        </div>
      </header>

      <table className="table" id="table" style={{ background: "white" }}>
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th className="text-center">Nombre cliente</th>
            <th className="text-center">Nombre usuario</th>
            <th className="text-center"></th>
            <th className="text-center"></th>
          </tr>
        </thead>

        <tbody>
          {detalles_cotizacionfil.map((item, key) => (
            <tr key={key}>
              <td key={key} className="text-center">
                {key + 1}{" "}
              </td>
              <td className="text-center">{item.cliente}</td>
              <td className="text-center">{item.vendedor}</td>
              <td>
                <Button
                  className="ver"
                  id="view"
                  onClick={() => hanldeView(item.id_cotizacion)}
                >
                  <AiOutlineSearch />
                </Button>
              </td>
              <td>
                <Button
                  className="btn btn-warning"
                  id="editar"
                  onClick={() => {
                    setSelectFactura(item.id_cotizacion);

                    setEditModalFactura(true);
                  }}
                >
                  <FaEdit />
                </Button>
              </td>
              <td>
                <Button
                  className="btn btn-danger"
                  onClick={() => dropCotizacion(item.id_cotizacion)}
                >
                  <AiFillDelete />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="modalcotiza">
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Nueva cotización</ModalHeader>

          <div className="clientearticulo">
            <div className="buscarcliente">
              <label className="scl"> Busca tu cliente </label>

              <Input
                className="buscarcliente"
                type="select"
                name="select"
                id="agregar"
                onChange={(e) => setIdCliente(e.target.value)}
              >
                {cliente.map((item) => (
                  <option key={item.idcliente} value={item.idcliente}>
                    {item.nombre}
                  </option>
                ))}
              </Input>
            </div>

            <div className="agregararticulo">
              <Button
                className=" agregarArM"
                id="agregarArM"
                onClick={() => agreArt()}
              >
                + Agregar Articulo
              </Button>
            </div>
          </div>

          <div className="descuentocostoenvio">
            <div id="oplogin" className="descuento">
              <label>Descuento</label>
              <select
                className="descuento"
                name="descuento"
                id="descuento"
                onChange={handleInputChange}
              >
                <option selected disabled value="">
                  Seleccione
                </option>
                <option value="1">20 %</option>
                <option value="2">30 %</option>
                <option value="3">50 %</option>
              </select>
            </div>

            <div className="costoenvio">
              <div id="oplogin" className="costoenvio">
                <label>Costo de envio</label>

                <select
                  className="costoenvio"
                  name="costo_envio"
                  id="costoenvio"
                  onChange={handleInputChange}
                >
                  <option selected disabled value="">
                    Seleccione
                  </option>
                  <option value="1">$ 5000 </option>
                  <option value="2">$ 6500 </option>
                  <option value="3">$ 7000 </option>
                </select>
              </div>
            </div>
          </div>

          <ModalBody>
            <div className="form-group">
              <Form>
                <table
                  className="table"
                  id="table"
                  style={{ marginTop: 24, background: "white" }}
                >
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center"> Articulo</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-center">Precio Unitario</th>
                      <th className="text-center">Precio Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {listAr.map((item, key) => (
                      <tr
                        key={"factura_".concat(item.id)}
                        id={"factura_".concat(item.id)}
                      >
                        <th className="text-center">{key + 1}</th>
                        <th>
                          <Input
                            type="select"
                            name="select"
                            id="exampleSelect"
                            required={true}
                            onChange={(e) => changeArt(e, item.id)}
                          >
                            {articulo.map((item) => (
                              <option
                                key={`articulo_${item.idarticulo}`}
                                value={item.idarticulo}
                              >
                                {item.nombre}
                              </option>
                            ))}
                          </Input>
                        </th>
                        <th>
                          {" "}
                          <Input
                            type="number"
                            name="cantidad"
                            id="cantidad"
                            onChange={(e) => changeCant(e, item.id)}
                          />
                        </th>
                        <th> {(item.precioU)} </th>
                        <th className="text-center">{(item.precioT)} </th>
                        <th>
                          <Button
                            className="eLiminar"
                            id="eliminar"
                            onClick={() => eliminarLisArt(item.id)}
                          >
                            <AiFillDelete />
                          </Button>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
      {editModalFactura && (
        <Edit
          idUser={props.user.id}
          id={selectFactura}
          isOpen={editModalFactura}
          toggle={() => setEditModalFactura(!editModalFactura)}
        />
      )}
    </div>
  );
};

export default Cotizacion;
