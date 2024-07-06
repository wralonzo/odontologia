import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { CircularProgress, Badge, styled } from '@mui/material';
import { SERVIDOR } from '../../../api/Servidor';
import dayjs from 'dayjs';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    height: 12,
    minWidth: 12,
    borderRadius: '50%',
    backgroundColor: 'red',
  },
}));

const ScheduleCalendar = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);
    fetch(`${SERVIDOR}/api/schedule`, {
      headers: { 'x-access-token': token },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los horarios.');
        }
        return response.json();
      })
      .then((data) => {
        setSchedules(data.schedules || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching schedules:', error);
        setError('Error al obtener los horarios.');
        setLoading(false);
      });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const markedDays = schedules.map((schedule) => dayjs(schedule.date).format('YYYY-MM-DD'));

  const renderDay = (date, _selectedDates, pickersDayProps) => {
    const formattedDate = date.format('YYYY-MM-DD');
    const isMarked = markedDays.includes(formattedDate);

    return (
      <StyledBadge
        key={date.toString()}
        overlap="circular"
        variant="dot"
        color={isMarked ? 'error' : 'primary'}
      >
        <div {...pickersDayProps}>{date.date()}</div>
      </StyledBadge>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar renderDay={renderDay} />
    </LocalizationProvider>
  );
};

export default ScheduleCalendar;