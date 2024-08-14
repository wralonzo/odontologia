import { Table, TableBody, TableCell, TableHead, TableRow, Button, TableFooter, TablePagination, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { SERVIDOR } from '../../../api/Servidor';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchAppointments = (page, limit) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);
    fetch(`${SERVIDOR}/api/appointment?page=${page + 1}&limit=${limit}`, {
      headers: { 'x-access-token': token }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las citas.');
        }
        return response.json();
      })
      .then((data) => {
        setAppointments(data.appointments || []);
        setTotalAppointments(data.totalAppointments || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
        setError('No hay citas disponibles.');
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

  const createAppointment = () => {
    navigate('/ui/create-appointment');
  };

  const handleDeleteLogicallyAppointment = (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      fetch(`${SERVIDOR}/api/appointment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({ appointment_id: id })
      })
        .then((response) => {
          if (response.ok) {
            alert('Cita eliminada correctamente');
            setAppointments(appointments.filter((appointment) => appointment.id !== id));
          } else {
            console.error('Error al eliminar la cita.');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar la cita:', error);
        });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <>
        <Button variant="contained" color="secondary" size="large" onClick={createAppointment}>
          Crear cita
        </Button>
        <div>{error}</div>
      </>
    );
  }

  return (
    <>
      <Button variant="contained" color="secondary" size="large" onClick={createAppointment}>
        Crear cita
      </Button>
      {appointments.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '15px' }}>ID</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Paciente</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Fecha y Hora</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Razón</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Notas</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Estado</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Editar</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell sx={{ fontSize: '15px' }}>{appointment.id}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{appointment.patient.full_name}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{new Date(appointment.appointment_datetime).toLocaleString('es-ES', { timeZone: 'UTC' }).replace(',', '').replace(/:.. /, ' ')}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{appointment.reason}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{appointment.notes}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{appointment.state}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      navigate(`/ui/update-appointment/${appointment.id}`, { state: { appointment: appointment } })
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
                    onClick={() => handleDeleteLogicallyAppointment(appointment.id)}
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
                count={totalAppointments}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        <Typography variant="subtitle1" align="center">
          No hay citas disponibles.
        </Typography>
      )}
    </>
  );
};

export default AppointmentList;