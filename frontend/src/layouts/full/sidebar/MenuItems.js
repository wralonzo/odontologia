import { IconCalendar, IconFile, IconLayoutDashboard, IconServicemark, IconUser } from '@tabler/icons';
import { uniqueId } from 'lodash';
import jwtUtils from '../../../api/jwtUtils';

const getUserType = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtUtils(token);
    return decoded?.type_of_user || '';
  }
  return '';
};

const userType = getUserType();

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Usuarios y Pacientes'
  },
  ...(userType === 'ADMINISTRATOR'
    ? [
      {
        id: uniqueId(),
        title: 'Usuarios',
        icon: IconUser,
        href: '/users'
      }
    ]
    : []),
  {
    id: uniqueId(),
    title: 'Pacientes',
    icon: IconUser,
    href: '/patients'
  },
  {
    navlabel: true,
    subheader: 'Agenda y Citas'
  },
  {
    id: uniqueId(),
    title: 'Citas',
    icon: IconCalendar,
    href: '/appointments'
  },
  {
    id: uniqueId(),
    title: 'Agenda',
    icon: IconCalendar,
    href: '/schedules'
  },
  {
    navlabel: true,
    subheader: 'Servicios'
  },
  {
    id: uniqueId(),
    title: 'Tratamientos',
    icon: IconServicemark,
    href: '/treatments'
  },
  {
    navlabel: true,
    subheader: 'Inventario'
  },
  {
    id: uniqueId(),
    title: 'Inventario',
    icon: IconFile,
    href: '/inventory'
  }
];

export default Menuitems;