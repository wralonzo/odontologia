import { useLocation } from 'react-router';
import React, { useState } from 'react';
import { Box, Button, Paper, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const ModificationCreationHealthQuestionnaire = () => {
  const { state } = useLocation();
  const patientData = state?.patient || {};
  const isPresentPatient = !!patientData.id;
  const [patientId] = useState(isPresentPatient ? patientData.id : '');
  const [patientSex] = useState(isPresentPatient ? patientData.sex : '');
  const [hypertension, setHypertension] = useState('');
  const [hypertensionControlled, setHypertensionControlled] = useState('');
  const [diabetes, setDiabetes] = useState('');
  const [diabetesControlled, setDiabetesControlled] = useState('');
  const [hospitalized, setHospitalized] = useState('');
  const [allergic, setAllergic] = useState('');
  const [excessiveBleeding, setExcessiveBleeding] = useState('');
  const [sheIsPregnant, setSheIsPregnant] = useState('');
  const [pregnant, setPregnant] = useState('');
  const [eatenLastSixHours, setEatenLastSixHours] = useState('');
  const [covidSymptoms, setCovidSymptoms] = useState('');
  const isFemale = patientSex === 'F';

  const handleSubmit = async () => {
    const questionnaireData = {
      patientId,
      hypertension,
      hypertensionControlled,
      diabetes,
      diabetesControlled,
      hospitalized,
      allergic,
      excessiveBleeding,
      sheIsPregnant: isFemale ? sheIsPregnant : null,
      pregnant: isFemale ? pregnant : null,
      eatenLastSixHours,
      covidSymptoms,
    };
  };

  const renderSelect = (label, value, onChange) => (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        <MenuItem value="SI">Sí</MenuItem>
        <MenuItem value="NO">No</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={4}>
      <Box maxWidth="600px" width="100%">
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align='center' mb={2} fontWeight={600}>
            Cuestionario de Salud
          </Typography>
          <Stack spacing={3}>
            <Typography variant="subtitle1" align='center' fontWeight={600}>
              Por favor conteste todas las preguntas
            </Typography>
            {renderSelect('¿Sufre de Hipertensión arterial?', hypertension, setHypertension)}
            {renderSelect('¿Está controlada? ¿Toma su tratamiento?', hypertensionControlled, setHypertensionControlled)}
            {renderSelect('¿Sufre de Diabetes?', diabetes, setDiabetes)}
            {renderSelect('¿Está controlada? ¿Toma su tratamiento?', diabetesControlled, setDiabetesControlled)}
            {renderSelect('¿Ha estado hospitalizado en los últimos dos años?', hospitalized, setHospitalized)}
            {renderSelect('¿Es alérgico a la aspirina, penicilina u otra medicina?', allergic, setAllergic)}
            {renderSelect('¿Ha tenido alguna vez algún sangramiento excesivo?', excessiveBleeding, setExcessiveBleeding)}
            {isFemale && renderSelect('¿Está embarazada? (solo si es mujer)', sheIsPregnant, setSheIsPregnant)}
            {isFemale && renderSelect('¿Está embarazada? (solo si es mujer)', pregnant, setPregnant)}
            {renderSelect('¿Ha comido algo en las últimas seis horas?', eatenLastSixHours, setEatenLastSixHours)}
            {renderSelect('¿Ha tenido síntomas como tos, fiebre, etc. en el último mes?', covidSymptoms, setCovidSymptoms)}
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

export default ModificationCreationHealthQuestionnaire;