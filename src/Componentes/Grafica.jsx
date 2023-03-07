import axios from "axios";
import React, { useEffect, useState } from "react";
import InformeVentas from "./Graficas/Users/InformeVentas";

const url = "http://localhost:3001/cotizacion";

const Grafica = () => {
  const [items, setItems] = useState([]); // los Items los valores totales de las ventas de cada usuario/admn
  const [labels, setLabels] = useState([]); // Los labels son los nombres de vendedores
  const [data, setData] = useState([]);

  useEffect(() => {
    listarCotizaciones();
  }, []);

  const listarCotizaciones = async () => {
    const res = await axios.get(url);
    const vendedores = res.data.map(({ vendedor }) => vendedor); // me traigo los nombres de todos los usuarios y admns

    // saco los nombres repetidos y nos genera una nueva lista con los nombres (unicos sin repetir)
    const users = vendedores.filter((nombre, index) => {
      return vendedores.indexOf(nombre) === index;
    });

    // asociar los valores de las cotiazaciones al usuario / vendedor
    const data = users.map((user) => {
      ///el array del usuario con sus ventas
      const element = {
        name: user,
        valor: [],
      };
      res.data.forEach((item) => {
        if (item.vendedor === user) {
          element.valor.push(item.valor);
        }
        setData([{ element }]);
      });
      return element;
    });

    const informe = data.map((user) => {
      ///la suma de los totale por usuario
      const totalVentas = user.valor.reduce((total, venta) => total + venta, 0);
      return {
        ...user,
        totalVentas: totalVentas,
      };
    });
    setItems(informe.map(({ totalVentas }) => totalVentas));
    setLabels(users);
  };

  return <InformeVentas items={items} labels={labels} data={[data]} />;
};
export default Grafica;
