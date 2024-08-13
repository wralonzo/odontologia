import { useLocation } from 'react-router';
import React, { useState } from 'react';
import { Box, Button, Paper, Stack, Typography, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { SERVIDOR } from '../../../../api/Servidor';

const ModificationCreationHealthQuestionnaire = () => {
  const { state } = useLocation();
  const patientData = state?.patient || {};
  const isPresentPatient = !!patientData.id;
  const [patientId] = useState(isPresentPatient ? patientData.id : '');
  const [patientSex] = useState(isPresentPatient ? patientData.sex : '');
  const [hypertension, setHypertension] = useState(false);
  const [hypertensionControlled, setHypertensionControlled] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [diabetesControlled, setDiabetesControlled] = useState(false);
  const [hospitalized, setHospitalized] = useState(false);
  const [allergic, setAllergic] = useState(false);
  const [excessiveBleeding, setExcessiveBleeding] = useState(false);
  const [sheIsPregnant, setSheIsPregnant] = useState(false);
  const [pregnant, setPregnant] = useState('');
  const [eatenLastSixHours, setEatenLastSixHours] = useState(false);
  const [covidSymptoms, setCovidSymptoms] = useState(false);
  const [seriousIllnesses, setSeriousIllnesses] = useState('');
  const isFemale = patientSex === 'F';

  const handleSubmit = async () => {
    const questionnaireData = {
      hypertension,
      hypertension_control: hypertensionControlled,
      diabetes,
      diabetes_control: diabetesControlled,
      hospitalization: hospitalized,
      medicine_allergy: allergic,
      bleeding: excessiveBleeding,
      serious_illnesses: seriousIllnesses,
      pregnancy: isFemale ? sheIsPregnant : null,
      pregnancy_months: isFemale ? parseInt(pregnant) : null,
      recent_meal: eatenLastSixHours,
      recent_symptoms: covidSymptoms,
      patient_id: patientId
    };

    try {
      const response = await fetch(`${SERVIDOR}/api/health-questionnarie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionnaireData),
      });
      if (response.ok) {
        alert('Cuestionario de salud registrado exitosamente.');
      } else {
        alert('Error al registrar el cuestionario de salud.');
      }
    } catch (error) {
      console.error('Error al enviar el cuestionario de salud:', error);
      alert('Error al enviar el cuestionario de salud.');
    }
  };

  const renderSelect = (label, value, onChange) => (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value ? 'SI' : 'NO'}
        onChange={(e) => onChange(e.target.value === 'SI')}
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
            <TextField
              fullWidth
              variant="outlined"
              label="Indique las enfermedades serias que ha padecido o que padece"
              value={seriousIllnesses}
              onChange={(e) => setSeriousIllnesses(e.target.value)}
            />
            {isFemale && (
              <>
                {renderSelect('¿Está embarazada?', sheIsPregnant, setSheIsPregnant)}
                <TextField
                  fullWidth
                  variant="outlined"
                  label="¿Cuántos meses de embarazo?"
                  type="number"
                  value={pregnant}
                  onChange={(e) => setPregnant(e.target.value)}
                  InputProps={{
                    inputProps: {
                      min: 0,
                      max: 9,
                    },
                  }}
                />
              </>
            )}
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