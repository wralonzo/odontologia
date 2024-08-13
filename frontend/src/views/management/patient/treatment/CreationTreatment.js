import { useLocation, useNavigate } from 'react-router';
import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Stack, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { SERVIDOR } from '../../../../api/Servidor';

const CreationTreatment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const patientData = state?.patient || {};
  const isPresentPatient = !!patientData.id;
  const [patientId] = useState(isPresentPatient ? patientData.id : '');
  const [treatment, setTreatment] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');
  const [treatmentsList, setTreatmentsList] = useState([]);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVIDOR}/api/treatment-plan-not-page`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTreatmentsList(data.records);
        } else {
          alert('Error al obtener la lista de tratamientos.');
        }
      } catch (error) {
        console.error('Error al obtener la lista de tratamientos:', error);
      }
    };
    fetchTreatments();
  }, []);

  const handleTreatmentChange = (event) => {
    const selectedTreatment = event.target.value;
    setTreatment(selectedTreatment);

    // Find the selected treatment's cost
    const selectedTreatmentData = treatmentsList.find(t => t.plan_details === selectedTreatment);
    if (selectedTreatmentData) {
      setCost(selectedTreatmentData.estimated_cost);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const evaluationData = {
      treatment,
      cost: parseFloat(cost),
      date,
      patient_id: patientId
    };

    try {
      const response = await fetch(`${SERVIDOR}/api/treatment`, {
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

  const renderSelectTreatment = () => (
    <FormControl fullWidth variant="outlined">
      <InputLabel>Tratamiento</InputLabel>
      <Select
        value={treatment}
        onChange={handleTreatmentChange}
        label="Tratamiento"
      >
        {treatmentsList.map((treatmentOption) => (
          <MenuItem key={treatmentOption.id} value={treatmentOption.plan_details}>
            {treatmentOption.plan_details}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={4}>
      <Box maxWidth="600px" width="100%">
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align='center' mb={2} fontWeight={600}>
            Tratamiento
          </Typography>
          <Stack spacing={3}>
            <Typography variant="subtitle1" align='center' fontWeight={600}>
              Por favor complete todos los campos
            </Typography>
            {renderSelectTreatment()}
            <TextField
              fullWidth
              variant="outlined"
              label="Costo"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              InputProps={{
                readOnly: true, // Make the cost field read-only
                inputProps: { min: 0 },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Fecha"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
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