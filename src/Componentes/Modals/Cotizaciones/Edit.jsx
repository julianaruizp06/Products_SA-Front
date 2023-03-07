import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Form,
} from "reactstrap";
import { AiFillDelete } from "react-icons/ai";
import { nanoid } from "nanoid";
import notify from "../../../utils/notify";
import { cop } from "../../../utils/i18";

const DATA = { id_cotizacion: 0, cliente: "", products: [], idcliente: 0 };
const CLIENT = [{ idcliente: 0, nombre: "" }];
const ARTICULOS = [
  { idarticulo: 0, nombre: "", precio_venta: 0, descripcion: "", estado: true },
];

const API = "http://localhost:3001/cotizacion";

const Edit = ({ isOpen, toggle, id, idUser }) => {
  const [data, setData] = useState(DATA);
  const [clients, setClients] = useState(CLIENT);
  const [articulos, setArticulo] = useState(ARTICULOS);
  const [listaProductos, setListaProductos] = useState([]);
  const [selClient, setSelClient] = useState(false);
  const [costoEnvio, setCostoEnvio] = useState("");
  const [descuento, setDescuento] = useState("");
  /*   cosnt [totalpagar, set] */

  useEffect(() => {
    if (id) {
      mount();
    }
  }, [id]);

  //FUNCION PARA GENERAR LISTA DE CLIENTES, ARTICULOS,COTIZACION
  const mount = async () => {
    await getCLients();
    await getArticulos();
    await getCotizacion();
  };

  ///descuento

  const setDescuentoParse = (valor) => {
    const valorDescuento = {
      20: 1,
      30: 2,
      50: 3,
    };
    return valorDescuento[valor];
  };

  const setCosto_envioParse = (valor) => {
    const Costo_envio = {
      "5000.00": "1",
      "6000.00": "2",
      "7000.00": "3",
    };
    return Costo_envio[valor];
  };

  const setCosto_envioBack = (valor) => {
    const Costo_envio = {
      1: 5000,
      2: 6000,
      3: 7000,
    };

    return Costo_envio[valor];
  };

  const setdescuentoBack = (valor) => {
    const valorDescuento = {
      1: 20,
      2: 30,
      3: 50,
    };

    return valorDescuento[valor];
  };

  //FUNCION PARA TRAER UNA COTIZACION POR MEDIO DE UN PARAMETRO
  const getCotizacion = async () => {
    try {
      const res = await axios.get(`${API}/${id}`);
      if (res) {
        setData(res.data || DATA);

        const descuentoParse = setDescuentoParse(res.data.descuento);

        setDescuento(descuentoParse);

        const Costo_envioParse = setCosto_envioParse(res.data.costo_envio);
        setCostoEnvio(Costo_envioParse);

        setListaProductos(res.data.products || []);

        setSelClient(res.data.idcliente || 0);
        const select = document.getElementById("client");
        select.value = res.data.idcliente;
      }
    } catch (error) {
      console.error(error);
    }
  };

  //FUNCIO PARA TRAER LA LISTA DE ARTICULOS
  const getArticulos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/articulo");
      setArticulo([{}, ...res.data] || []);
    } catch (error) {
      console.error(error);
    }
  };
  //FUNCIO PARA TRAER LA LISTA DE CLIENTES
  const getCLients = async () => {
    try {
      const res = await axios.get("http://localhost:3001/cliente");
      setClients(res ? [{}, ...res.data] : []);
    } catch (error) {
      console.error(error);
    }
  };
  //FUNCIO PARA CAMBIAR EL ARTICULO
  const changeArt = (id, idFactura) => {
    try {
      //RECIBIMOS COMO PARAMETRO EL ID DEL ARTICULO Y EL ID DE LA FACTURA
      const articulo = articulos.find((item) => item.idarticulo == id);
      const data = listaProductos.map((item) =>
        item.iddetalle == idFactura
          ? {
              ...item,
              idarticulo: id || 0,
              cantidad: 1,
              subtotal: id ? Number(articulo.precio_venta) : 0,
              total: id ? articulo.precio_venta * 1 : 0,
              producto: id ? articulo.nombre : "",
            }
          : item
      );
      setListaProductos(data);
      document.getElementById(`cantidad_${idFactura}`).value = 1;
    } catch (error) {
      console.error(error);
    }
  };

  //FUNCION PARA CAMBIAR LA CANTIDAD
  const changeCant = (value, idFactura) => {
    try {
      const data = listaProductos.map((item) =>
        item.iddetalle == idFactura
          ? { ...item, cantidad: value, total: item.subtotal * value }
          : item
      );
      setListaProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  //FUNCION PARA AÑADIR FILA PARA UN NUEVO ARTICULO
  const addRow = () => {
    const row = {
      id_cotizacion: data.id_cotizacion,
      iddetalle: nanoid(),
      cantidad: 0,
      total: 0,
      subtotal: 0,
      idarticulo: 0,
    };
    setListaProductos([...listaProductos, row]);
  };

  const removeRow = (id) => {
    const data = listaProductos.filter((item) => item.iddetalle != id);
    setListaProductos(data);
  };
  //FUNCION PARA ENVIAR EL FORMULARIO YA EDITADO
  const handleSubmit = async (e) => {
    e.preventDefault();

    const costoBack = setCosto_envioBack(costoEnvio);

    const descBack = setdescuentoBack(descuento);

    const valorDes = Number(data.valor - data.valor * (descuento / 100)); //valor del total con descuento
    const costo_envio = Number(costoEnvio);
    const total_pagar = Number(valorDes + costo_envio); //valorfinal a pagar

    const payload = {
      articulos: listaProductos,
      id_cotizacion: data.id_cotizacion,
      idclient: selClient,
      descuento: Number(descBack),
      costo_envio: Number(costoBack),
      total_pagar,
    };

    const res = await axios.put("http://localhost:3001/cotizacion", payload);
    if (res) {
      notify();
      toggle();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>Editar</ModalHeader>

        <div className="clientearticulo">
          <div className="buscarcliente">
            <label className="scl"> Busca tu cliente </label>
            <Input
              className="buscarcliente"
              type="select"
              name="select"
              id="client"
              onChange={(e) => setSelClient(e.target.value)}
            >
              {clients.map((item) => (
                <option key={item.nombre} value={item.idcliente}>
                  {item.nombre}
                </option>
              ))}
            </Input>
          </div>

          <div className="agregararticulo">
            <Button
              className=" agregarArM"
              id="agregarArM"
              onClick={() => addRow()}
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
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
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
                value={costoEnvio}
                onChange={(e) => setCostoEnvio(e.target.value)}
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
            <table
              className="table"
              id="table"
              style={{ marginTop: 60, background: "white" }}
            >
              <thead className="bg-secondary text-white">
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center"> Articulo</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-center">Precio Unitario</th>
                  <th className="text-center">Precio Total</th>
                  <th className="text-center">Borrar</th>
                </tr>
              </thead>
              <tbody>
                {listaProductos.map((item, key) => (
                  <tr
                    key={"factura_".concat(item.iddetalle)}
                    id={"factura_".concat(item.iddetalle)}
                  >
                    <th className="pt-3">{key + 1}</th>
                    <th>
                      <Input
                        required={true}
                        type="select"
                        name="articulo"
                        defaultValue={item.idarticulo}
                        onChange={(e) => {
                          changeArt(e.target.value, item.iddetalle);
                        }}
                      >
                        {articulos.map((item) => (
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
                      <div className="justify-content-center d-flex">
                        <Input
                          min={1}
                          required={true}
                          type="number"
                          name="cantidad"
                          className="w-50"
                          id={`cantidad_${item.iddetalle}`}
                          defaultValue={item.cantidad}
                          onChange={(e) => {
                            changeCant(e.target.value, item.iddetalle);
                          }}
                        />
                      </div>
                    </th>
                    <th className="pt-3"> {cop(Number(item.subtotal))} </th>
                    <th className="pt-3">{cop(Number(item.total))} </th>
                    <th>
                      <Button
                        className="eLiminar"
                        color="danger"
                        id="eliminar"
                        onClick={() => removeRow(item.iddetalle)}
                      >
                        <AiFillDelete />
                      </Button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            Actualizar
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default Edit;
