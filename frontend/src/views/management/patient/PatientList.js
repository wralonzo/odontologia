import { Table, TableBody, TableCell, TableHead, TableRow, Button, TableFooter, TablePagination, CircularProgress, Typography, Modal, Box, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { SERVIDOR } from '../../../api/Servidor';
import PaperIcon from '@mui/icons-material/Description';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [clinicalHistory, setClinicalHistory] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
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
        setPatients(data.patients || []);
        setTotalPatients(data.totalPatients || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
        setError('No hay pacientes disponibles.');
        setLoading(false);
      });
  };

  const fetchClinicalHistory = (patientId) => {
    const token = localStorage.getItem('token');
    fetch(`${SERVIDOR}/api/clinical-history/patient/${patientId}`, {
      headers: { 'x-access-token': token }
    })
      .then((response) => response.json())
      .then((data) => {
        setClinicalHistory(data.records || []);
        setSelectedPatientId(patientId);
        setOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching clinical history:', error);
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

  const handleClose = () => {
    setOpen(false);
    setClinicalHistory([]);
    setSelectedPatientId(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <>
        <Button variant="contained" color="secondary" size="large" onClick={createPatient}>
          Crear paciente
        </Button>
        <div>{error}</div>
      </>
    );
  }

  return (
    <>
      <Button variant="contained" color="secondary" size="large" onClick={createPatient}>
        Crear paciente
      </Button>
      {patients.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '15px' }}>ID</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Nombre Completo</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Dirección</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Sexo</TableCell>
              {/* 
              <TableCell sx={{ fontSize: '15px' }}>Fecha de nacimiento</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Contacto de emergencia</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Telefono de emergencia</TableCell>
              */}
              <TableCell sx={{ fontSize: '15px' }}>Cuestionario</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Evaluación</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Tratamientos</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Historial</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Editar</TableCell>
              <TableCell sx={{ fontSize: '15px' }}>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell sx={{ fontSize: '15px' }}>{patient.id}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{patient.full_name}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{patient.address}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{patient.sex}</TableCell>
                {/*
                <TableCell sx={{ fontSize: '15px' }}>{patient.birth_date}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{patient.emergency_contact}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{patient.emergency_phone}</TableCell>
                */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      navigate(`/ui/create-health-questionnaire/${patient.id}`, { state: { patient: patient } })
                    }
                  >
                    Salud
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      navigate(`/ui/create-physical-evaluation/${patient.id}`, { state: { patient: patient } })
                    }
                  >
                    Fisica
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      navigate(`/ui/create-treatment/${patient.id}`, { state: { patient: patient } })
                    }
                  >
                    Tratamiento
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => fetchClinicalHistory(patient.id)}
                  >
                    <PaperIcon />
                  </IconButton>
                </TableCell>
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
      ) : (
        <Typography variant="subtitle1" align="center">
          No hay pacientes disponibles.
        </Typography>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, bgcolor: 'background.paper', margin: 'auto', maxWidth: 600, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute' }}>
          <Typography variant="h6" component="h2">
            Historial Clínico
          </Typography>
          {clinicalHistory.length > 0 ? (
            clinicalHistory.map((record) => (
              <Box key={record.id} sx={{ my: 2 }}>
                <Typography variant="body1"><strong>Detalles:</strong> {record.details}</Typography>
                <Typography variant="body1"><strong>Fecha:</strong> {new Date(record.date).toLocaleDateString()}</Typography>
                <Typography variant="body1"><strong>Estado:</strong> {record.status ? 'Activo' : 'Inactivo'}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1">No hay registros disponibles.</Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PatientList;