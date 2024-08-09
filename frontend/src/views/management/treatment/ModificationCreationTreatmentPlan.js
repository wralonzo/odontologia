import { useLocation, useNavigate } from 'react-router';
import React, { useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { SERVIDOR } from '../../../api/Servidor';
import { fontSize } from '@mui/system';

const ModificationCreationTreatmentPlan = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const itemData = state?.item || {};
  const isEditing = !!itemData.id;
  const [itemId] = useState(isEditing ? itemData.id : '');
  const [planDetails, setPlanDetails] = useState(isEditing ? itemData.plan_details : '');
  const [estimatedCost, setEstimatedCost] = useState(isEditing ? itemData.estimated_cost : '');

  const handleSubmit = async () => {
    const itemDataToUpdate = {
      plan_details: planDetails,
      estimated_cost: estimatedCost,
    };
    if (isEditing) {
      itemDataToUpdate.id = itemId;
      return handleUpdate(parseInt(itemData.id), itemDataToUpdate);
    } else {
      return handleCreate(itemDataToUpdate);
    }
  };

  const handleCreate = async (itemData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVIDOR}/api/treatment-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(itemData),
      });
      if (response.ok) {
        alert('Plan de tratamiento creado con éxito.');
        navigate('/treatments');
      } else {
        alert('Error al crear el plan de tratamiento.');
      }
    } catch (error) {
      alert('No se puede crear el plan de tratamiento en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleUpdate = async (itemId, itemData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVIDOR}/api/treatment-plan/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(itemData),
      });
      if (response.ok) {
        alert('Plan de tratamiento actualizado con éxito.');
        navigate('/treatments');
      } else {
        alert('Error al actualizar el plan de tratamiento.');
      }
    } catch (error) {
      alert('No se puede actualizar el plan de tratamiento en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={4}>
      <Box maxWidth="800px" width="100%">
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align='center' mb={2} fontWeight={600}>
            {isEditing ? 'Actualizar información del plan de tratamiento' : 'Agregar información del plan de tratamiento'}
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="name"
                mb="5px"
                sx={{ fontSize: '18px' }}
              >
                Tratamiento
              </Typography>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth value={planDetails}
                onChange={(e) => setPlanDetails(e.target.value)}
                sx={{ fontSize: '16px' }}
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="description"
                mb="5px"
                sx={{ fontSize: '18px' }}
              >
                Costo
              </Typography>
              <CustomTextField
                id="description"
                variant="outlined"
                fullWidth value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                sx={{ fontSize: '16px' }}
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
                {isEditing ? 'Actualizar' : 'Guardar'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default ModificationCreationTreatmentPlan;