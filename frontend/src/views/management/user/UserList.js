import { Table, TableBody, TableCell, TableHead, TableRow, Button, TableFooter, TablePagination, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { SERVIDOR } from '../../../api/Servidor';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchUsers = (page, limit) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);
    fetch(`${SERVIDOR}/api/user?page=${page + 1}&limit=${limit}`, {
      headers: { 'x-access-token': token }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios.');
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data.users || []);
        setTotalUsers(data.totalUsers || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setError('Error al obtener los usuarios.');
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

  const crateUser = () => {
    navigate('/ui/create-user');
  };

  const handleDeleteLogicallyUser = (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      fetch(`${SERVIDOR}/api/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({ id })
      })
        .then((response) => {
          if (response.ok) {
            alert('Usuario eliminado correctamente');
            setUsers(users.filter((user) => user.id !== id));
          } else {
            console.error('Error al eliminar el usuario.');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar el usuario:', error);
        });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Button variant="contained" color="secondary" size="large" onClick={crateUser}>
        Crear usuario
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: '15px' }}>ID</TableCell>
            <TableCell sx={{ fontSize: '15px' }}>Nombre</TableCell>
            <TableCell sx={{ fontSize: '15px' }}>Apellido</TableCell>
            <TableCell sx={{ fontSize: '15px' }}>Teléfono</TableCell>
            <TableCell sx={{ fontSize: '15px' }}>Dirección</TableCell>
            <TableCell sx={{ fontSize: '15px' }}>Email</TableCell>
            <TableCell sx={{ fontSize: '15px' }}>Tipo de Usuario</TableCell>
            <TableCell sx={{ fontSize: '15px' }}>Editar</TableCell>
            <TableCell sx={{ fontSize: '15px' }}>Eliminar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell sx={{ fontSize: '15px' }}>{user.id}</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>{user.name}</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>{user.last_name}</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>{user.phone}</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>{user.address}</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>{user.email}</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>{user.type_of_user}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() =>
                    navigate(`/ui/update-user/${user.id}`, { state: { user: user } })
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
                  onClick={() => handleDeleteLogicallyUser(user.id)}
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
              count={totalUsers}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default UserList;