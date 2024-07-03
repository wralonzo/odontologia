import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { SERVIDOR } from 'src/api/Servidor';

const MaterialProducto = () => {
  const [materiales, setMateriales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${SERVIDOR}/api/MaterialProducto`)
      .then((response) => response.json())
      .then((data) => {
        setMateriales(data);
      });
  }, []);

  const agregarMaterial = () => {
    navigate('/ui/agregar-material');
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este material?')) {
      fetch(`${SERVIDOR}/api/MaterialProducto/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.status === 204) {
            alert('Material eliminado correctamente');
            setMateriales(materiales.filter((material) => material.id !== id));
          } else {
            console.error('Error al eliminar el material.');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar el material:', error);
        });
    }
  };

  return (
    <>
      <Button variant="contained" color="secondary" size="large" onClick={agregarMaterial}>
        Agregar Material
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Material</TableCell>
            <TableCell>Editar</TableCell>
            <TableCell>Eliminar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materiales.map((material, index) => (
            <TableRow key={index}>
              <TableCell>{material.id}</TableCell>
              <TableCell>{material.material}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() =>
                    navigate(`/ui/editar-material/${material.id}`, { state: { material: material } })
                  }
                >
                  Editar
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleEliminar(material.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default MaterialProducto;