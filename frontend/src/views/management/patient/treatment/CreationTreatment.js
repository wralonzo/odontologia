import { useLocation, useNavigate } from 'react-router';
import React, { useState } from 'react';
import { Box, Button, Paper, Stack, Typography, TextField } from '@mui/material';
import { SERVIDOR } from '../../../../api/Servidor';

const CreationTreatment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const patientData = state?.patient || {};
  const isPresentPatient = !!patientData.id;
  const [patientId] = useState(isPresentPatient ? patientData.id : '');
  const [bloodPressure, setBloodPressure] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [lastTreatment, setLastTreatment] = useState('');
  const [otherData, setOtherData] = useState('');

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const evaluationData = {
      blood_pressure: bloodPressure,
      blood_sugar: bloodSugar,
      last_treatment: lastTreatment,
      other_data: otherData,
      patient_id: patientId
    };

    try {
      const response = await fetch(`${SERVIDOR}/api/physical-evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(evaluationData),
      });

      if (response.ok) {
        alert('Evaluación física guardada exitosamente.');
        navigate('/patients');
      } else {
        alert('Error al guardar la evaluación física.');
      }
    } catch (error) {
      console.error('Error al guardar la evaluación física:', error);
      alert('Error al guardar la evaluación física.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={4}>
      <Box maxWidth="600px" width="100%">
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align='center' mb={2} fontWeight={600}>
            Evaluación Física
          </Typography>
          <Stack spacing={3}>
            <Typography variant="subtitle1" align='center' fontWeight={600}>
              Por favor complete todos los campos
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Presión Arterial"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Nivel de Azúcar en Sangre"
              value={bloodSugar}
              onChange={(e) => setBloodSugar(e.target.value)}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Último Tratamiento"
              value={lastTreatment}
              onChange={(e) => setLastTreatment(e.target.value)}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Otros Datos"
              value={otherData}
              onChange={(e) => setOtherData(e.target.value)}
            />
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

export default CreationTreatment;