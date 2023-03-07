import React, { useState, useEffect } from "react";
//generar fecha en la cotizacion
function CurrentDateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p>Fecha actual: {dateTime.toLocaleDateString()}</p>
      <p>Hora actual: {dateTime.toLocaleTimeString()}</p>
    </div>
  );
}

export default CurrentDateTime;
