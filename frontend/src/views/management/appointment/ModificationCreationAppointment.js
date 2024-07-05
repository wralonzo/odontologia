import { useLocation, useNavigate } from 'react-router';
import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Stack, Typography, Select, MenuItem } from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { SERVIDOR } from '../../../api/Servidor';

const formatDateTime = (datetime) => {
  if (!datetime) return '';
  const date = new Date(datetime);
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
  return localISOTime;
};

const ModificationCreationAppointment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appointmentData = state?.appointment || {};
  const isEditing = !!appointmentData.id;
  const [appointmentId] = useState(isEditing ? appointmentData.id : '');
  const [appointmentDatetime, setAppointmentDatetime] = useState(isEditing ? formatDateTime(appointmentData.appointment_datetime) : '');
  const [reason, setReason] = useState(isEditing ? appointmentData.reason : '');
  const [notes, setNotes] = useState(isEditing ? appointmentData.notes : '');
  const [status, setStatus] = useState(isEditing ? appointmentData.state : '');
  const [patientId, setPatientId] = useState(isEditing ? appointmentData.patient_id : '');
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVIDOR}/api/patient`, {
        headers: {
          'x-access-token': token
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients);
      } else {
        console.error('Error al cargar la lista de pacientes');
      }
    } catch (error) {
      console.error('Error al cargar la lista de pacientes:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async () => {
    const appointmentDataToUpdate = {
      appointment_datetime: appointmentDatetime,
      reason,
      notes,
      patient_id: patientId,
      state: status
    };
    if (isEditing) {
      appointmentDataToUpdate.id = appointmentId;
      return handleUpdate(appointmentId, appointmentDataToUpdate);
    } else {
      return handleCreate(appointmentDataToUpdate);
    }
  };

  const handleCreate = async (appointmentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVIDOR}/api/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(appointmentData),
      });
      if (response.ok) {
        alert('Cita creada con éxito.');
        navigate('/appointments');
      } else {
        alert('Error al crear la cita.');
      }
    } catch (error) {
      alert('No se puede crear la cita en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleUpdate = async (appointmentId, appointmentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVIDOR}/api/appointment/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(appointmentData),
      });
      if (response.ok) {
        alert('Cita actualizada con éxito.');
        navigate('/appointments');
      } else {
        alert('Error al actualizar la cita.');
      }
    } catch (error) {
      alert('No se puede actualizar la cita en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={4}>
      <Box maxWidth="500px" width="100%">
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align='center' mb={2} fontWeight={600}>
            {isEditing ? 'Modificar cita' : 'Agregar cita'}
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="appointmentDatetime" mb="5px">
                Fecha y Hora de la Cita
              </Typography>
              <CustomTextField
                id="appointmentDatetime"
                variant="outlined"
                fullWidth
                value={appointmentDatetime}
                onChange={(e) => setAppointmentDatetime(e.target.value)}
                inputProps={{ type: 'datetime-local' }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="reason" mb="5px">
                Razón de la Cita
              </Typography>
              <CustomTextField
                id="reason"
                variant="outlined"
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="notes" mb="5px">
                Notas
              </Typography>
              <CustomTextField
                id="notes"
                variant="outlined"
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="patientId" mb="5px">
                Paciente
              </Typography>
              <Select
                id="patientId"
                variant="outlined"
                fullWidth
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              >
                {patients.map(patient => (
                  <MenuItem key={patient.id} value={patient.id}>{patient.full_name}</MenuItem>
                ))}
              </Select>
            </Box>
            {isEditing && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="status" mb="5px">
                  Estado de la Cita
                </Typography>
                <Select
                  id="status"
                  variant="outlined"
                  fullWidth
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="SCHEDULED">Programada</MenuItem>
                  <MenuItem value="CANCELED">Cancelada</MenuItem>
                  <MenuItem value="COMPLETED">Completada</MenuItem>
                </Select>
              </Box>
            )}
            <Box>
              <Button color="primary" variant="contained" size="large" fullWidth onClick={handleSubmit}>
                Guardar
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default ModificationCreationAppointment;