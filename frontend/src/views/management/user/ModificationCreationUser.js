import { useLocation, useNavigate } from 'react-router';
import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { SERVIDOR } from '../../../api/Servidor';

const ModificationCreationUser = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const materialData = state?.material || {};
  const isEditing = !!materialData.id;
  const [material, setMaterial] = useState(isEditing ? materialData.material : '');

  const handleSubmit = async () => {
    if (isEditing) {
      return handleActualizar(materialData.id);
    } else {
      return handleCrear();
    }
  };

  const handleCrear = async () => {
    try {
      const response = await fetch(`${SERVIDOR}/api/MaterialProducto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          material,
        }),
      });

      if (response.ok) {
        navigate('/ui/material-productos');
      } else {
        alert('Error al registrar el material.');
      }
    } catch (error) {
      alert('No se puede registrar el material en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleActualizar = async (materialId) => {
    try {
      const response = await fetch(`${SERVIDOR}/api/MaterialProducto/${materialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(materialId),
          material,
        }),
      });

      if (response.status === 200) {
        navigate('/ui/material-productos');
      } else {
        alert('Error al actualizar el material.');
      }
    } catch (error) {
      alert('No se puede actualizar el material en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={4}>
      <Box maxWidth="500px" width="100%">
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="material"
              mb="5px"
            >
              Material
            </Typography>
            <CustomTextField
              id="material"
              variant="outlined"
              fullWidth
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            />
          </Box>
          <Box>
            <Button color="primary" variant="contained" size="large" fullWidth onClick={handleSubmit}>
              Guardar
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ModificationCreationUser;