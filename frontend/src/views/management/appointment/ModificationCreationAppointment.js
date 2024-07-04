import { useLocation, useNavigate } from 'react-router';
import React, { useState } from 'react';
import { Box, Button, Paper, Stack, Typography, Select, MenuItem } from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { SERVIDOR } from '../../../api/Servidor';

const ModificationCreationAppointment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appointmentData = state?.appointment || {};
  const isEditing = !!appointmentData.id;
  const [appointmentId] = useState(isEditing ? appointmentData.id : '');
  const [appointmentDatetime, setAppointmentDatetime] = useState(isEditing ? appointmentData.appointment_datetime : '');
  const [reason, setReason] = useState(isEditing ? appointmentData.reason : '');
  const [notes, setNotes] = useState(isEditing ? appointmentData.notes : '');
  const [status, setStatus] = useState(isEditing ? appointmentData.status : ''); // Nuevo estado para el campo status

  const handleSubmit = async () => {
    const appointmentDataToUpdate = {
      id: appointmentId,
      appointment_datetime: appointmentDatetime,
      reason,
      notes,
      status // Añadimos el campo status al objeto que se enviará
    };

    if (isEditing) {
      return handleUpdate(parseInt(appointmentData.id), appointmentDataToUpdate);
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
        alert('Cita actualizada con éxito.')
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
              <CustomTextField id="appointmentDatetime" variant="outlined" fullWidth value={appointmentDatetime} onChange={(e) => setAppointmentDatetime(e.target.value)} inputProps={{ type: 'datetime-local' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="reason" mb="5px">
                Razón de la Cita
              </Typography>
              <CustomTextField id="reason" variant="outlined" fullWidth value={reason} onChange={(e) => setReason(e.target.value)} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="notes" mb="5px">
                Notas
              </Typography>
              <CustomTextField id="notes" variant="outlined" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} />
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
                  <MenuItem value="SCHEDULE">Programada</MenuItem>
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