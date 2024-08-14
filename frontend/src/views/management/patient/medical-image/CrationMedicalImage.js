import { useLocation, useNavigate } from 'react-router';
import React, { useState } from 'react';
import { Box, Button, Paper, Stack, Typography, TextField } from '@mui/material';
import { SERVIDOR } from '../../../../api/Servidor';

const CreationMedicalImage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const patientData = state?.patient || {};
  const isPresentPatient = !!patientData.id;
  const [patientId] = useState(isPresentPatient ? patientData.id : '');
  const [description, setDescription] = useState('');
  const [image_base_64, setImage] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('description', description);
    formData.append('image_base_64', image_base_64);
    formData.append('patient_id', patientId);

    try {
      const response = await fetch(`${SERVIDOR}/api/medical-image`, {
        method: 'POST',
        headers: {
          'x-access-token': token
        },
        body: formData,
      });

      if (response.ok) {
        alert('Imagen médica guardada exitosamente.');
        navigate('/patients');
      } else {
        alert('Error al guardar la imagen médica.');
      }
    } catch (error) {
      console.error('Error al guardar la imagen médica:', error);
      alert('Error al guardar la imagen médica.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={4}>
      <Box maxWidth="600px" width="100%">
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align='center' mb={2} fontWeight={600}>
            Imagen Médica
          </Typography>
          <Stack spacing={3}>
            <Typography variant="subtitle1" align='center' fontWeight={600}>
              Por favor complete todos los campos
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-image"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="upload-image">
              <Button variant="contained" component="span">
                Cargar Imagen
              </Button>
            </label>
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

export default CreationMedicalImage;