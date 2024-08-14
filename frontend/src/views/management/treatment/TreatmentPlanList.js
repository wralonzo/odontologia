import { Table, TableBody, TableCell, TableHead, TableRow, Button, TableFooter, TablePagination, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { SERVIDOR } from '../../../api/Servidor';

const TreatmentPlanList = () => {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchItems = (page, limit) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);
    fetch(`${SERVIDOR}/api/treatment-plan?page=${page + 1}&limit=${limit}`, {
      headers: { 'x-access-token': token }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los artículos de los planes de tratamientos.');
        }
        return response.json();
      })
      .then((data) => {
        setItems(data.records || []);
        setTotalItems(data.totalRecords || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching inventory items:', error);
        setError('Error al obtener los artículos de los planes de tratamientos.');
        setLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createItem = () => {
    navigate('/ui/create-treatment-plan');
  };

  const handleDeleteLogicallyItem = (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      fetch(`${SERVIDOR}/api/treatment-plan`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({ id })
      })
        .then((response) => {
          if (response.ok) {
            alert('Artículo eliminado correctamente');
            setItems(items.filter((item) => item.id !== id));
          } else {
            console.error('Error al eliminar el artículo.');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar el artículo:', error);
        });
    }
  };

  return (
    <>
      <Button variant="contained" color="secondary" size="large" onClick={createItem}>
        Crear plan de tratamiento
      </Button>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : items.length === 0 ? (
        <Typography variant="body1">
          No hay artículos en los planes de tratamientos.
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '15px' }}>ID</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Tratamiento</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Costo</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Editar</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ fontSize: '15px' }}>{item.id}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{item.plan_details}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{item.estimated_cost}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      navigate(`/ui/update-treatment-plan/${item.id}`, { state: { item: item } })
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
                    onClick={() => handleDeleteLogicallyItem(item.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  );
};

export default TreatmentPlanList;