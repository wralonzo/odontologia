import { useLocation, useNavigate } from 'react-router';
import React, { useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { SERVIDOR } from '../../../api/Servidor';

const ModificationCreationPatient = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const patientData = state?.patient || {};
  const isEditing = !!patientData.id;
  const [patientId] = useState(isEditing ? patientData.id : '');
  const [fullName, setFullName] = useState(isEditing ? patientData.full_name : '');
  const [address, setAddress] = useState(isEditing ? patientData.address : '');
  const [sex, setSex] = useState(isEditing ? patientData.sex : '');
  const [birthDate, setBirthDate] = useState(isEditing ? patientData.birth_date : '');
  const [emergencyContact, setEmergencyContact] = useState(isEditing ? patientData.emergency_contact : '');
  const [emergencyPhone, setEmergencyPhone] = useState(isEditing ? patientData.emergency_phone : '');

  const handleSubmit = async () => {
    const patientDataToUpdate = {
      id: patientId,
      full_name: fullName,
      address,
      sex,
      birth_date: birthDate,
      emergency_contact: emergencyContact,
      emergency_phone: emergencyPhone
    };
    if (isEditing) {
      return handleUpdate(parseInt(patientData.id), patientDataToUpdate);
    } else {
      return handleCreate(patientDataToUpdate);
    }
  };

  const handleCreate = async (patientData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVIDOR}/api/patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(patientData),
      });
      if (response.ok) {
        alert('Paciente creado con éxito.');
        navigate('/patients');
      } else {
        alert('Error al crear el paciente.');
      }
    } catch (error) {
      alert('No se puede crear el paciente en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleUpdate = async (patientId, patientData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVIDOR}/api/patient/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(patientData),
      });
      if (response.ok) {
        alert('Paciente actualizado con éxito.')
        navigate('/patients');
      } else {
        alert('Error al actualizar el paciente.');
      }
    } catch (error) {
      alert('No se puede actualizar el paciente en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={4}>
      <Box maxWidth="600px" width="100%">
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align='center' mb={2} fontWeight={600}>
            {isEditing ? 'Modificar información del paciente' : 'Agregar información del paciente'}
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="fullName"
                mb="5px"
              >
                Nombre Completo
              </Typography>
              <CustomTextField
                id="fullName"
                variant="outlined"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="address"
                mb="5px"
              >
                Dirección
              </Typography>
              <CustomTextField
                id="address"
                variant="outlined"
                fullWidth value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="sex"
                mb="5px">
                Sexo (M/F)
              </Typography>
              <CustomTextField
                id="sex"
                variant="outlined"
                fullWidth value={sex}
                onChange={(e) => setSex(e.target.value.toUpperCase().slice(0, 1))}
                inputProps={{ maxLength: 1 }}
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="birthDate"
                mb="5px">
                Fecha de Nacimiento
              </Typography>
              <CustomTextField
                id="birthDate"
                variant="outlined"
                fullWidth
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                inputProps={{ type: 'date' }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="emergencyContact"
                mb="5px"
              >
                Contacto de Emergencia
              </Typography>
              <CustomTextField
                id="emergencyContact"
                variant="outlined"
                fullWidth
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="emergencyPhone"
                mb="5px"
              >
                Teléfono de Emergencia
              </Typography>
              <CustomTextField
                id="emergencyPhone"
                variant="outlined"
                fullWidth value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </Box>
            <Box>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}
              >
                Guardar
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default ModificationCreationPatient;