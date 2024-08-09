import React, { useEffect, useState } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';
import { SERVIDOR } from '../../../api/Servidor';

const ScheduleCalendar = () => {
  const [schedules, setSchedules] = useState([]);
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedules(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchSchedules = (page, limit) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);
    fetch(`${SERVIDOR}/api/schedule?page=${page + 1}&limit=${limit}`, {
      headers: { 'x-access-token': token }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los horarios.');
        }
        return response.json();
      })
      .then((data) => {
        setSchedules(data.schedules || []);
        setTotalSchedules(data.totalSchedules || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching schedules:', error);
        setError('Error al obtener los horarios.');
        setLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontSize: '15px' }}>Fecha</TableCell>
          <TableCell sx={{ fontSize: '15px' }}>Nombre del Paciente</TableCell>
          <TableCell sx={{ fontSize: '15px' }}>Motivo de la Cita</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow key={schedule.id}>
            <TableCell sx={{ fontSize: '15px' }}>{schedule.date}</TableCell>
            <TableCell sx={{ fontSize: '15px' }}>{schedule.appointment?.patient?.full_name}</TableCell>
            <TableCell sx={{ fontSize: '15px' }}>{schedule.appointment?.reason}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            count={totalSchedules}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ScheduleCalendar;