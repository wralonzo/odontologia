import { Table, TableBody, TableCell, TableHead, TableRow, Button, TableFooter, TablePagination, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { SERVIDOR } from '../../../api/Servidor';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchPatients = (page, limit) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);
    fetch(`${SERVIDOR}/api/patient?page=${page + 1}&limit=${limit}`, {
      headers: { 'x-access-token': token }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los pacientes.');
        }
        return response.json();
      })
      .then((data) => {
        setPatients(data.users || []);
        setTotalPatients(data.totalUsers || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
        setError('Error al obtener los pacientes.');
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

  const createPatient = () => {
    navigate('/ui/create-patient');
  };

  const handleDeleteLogicallyPatient = (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      fetch(`${SERVIDOR}/api/patient`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({ id })
      })
        .then((response) => {
          if (response.ok) {
            alert('Paciente eliminado correctamente');
            setPatients(patients.filter((patient) => patient.id !== id));
          } else {
            console.error('Error al eliminar el paciente.');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar el paciente:', error);
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
      <Button variant="contained" color="secondary" size="large" onClick={createPatient}>
        Crear paciente
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre Completo</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Sexo</TableCell>
            <TableCell>Fecha de nacimiento</TableCell>
            <TableCell>Contacto de emergencia</TableCell>
            <TableCell>Telefono de emergencia</TableCell>
            <TableCell>Editar</TableCell>
            <TableCell>Eliminar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.id}</TableCell>
              <TableCell>{patient.full_name}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.sex}</TableCell>
              <TableCell>{patient.birth_date}</TableCell>
              <TableCell>{patient.emergency_contact}</TableCell>
              <TableCell>{patient.emergency_phone}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() =>
                    navigate(`/ui/update-patient/${patient.id}`, { state: { patient: patient } })
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
                  onClick={() => handleDeleteLogicallyPatient(patient.id)}
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
              count={totalPatients}
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

export default PatientList;