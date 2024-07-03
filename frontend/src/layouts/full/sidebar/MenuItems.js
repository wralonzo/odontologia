import { IconLayoutDashboard, IconUser } from '@tabler/icons';
import { uniqueId } from 'lodash';
import jwtUtils from '../../../api/jwtUtils';

const getUserType = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtUtils(token);
    console.log('decoded:', decoded);
    console.log('decoded:', decoded.type_of_user);
    return decoded?.type_of_user || '';
  }
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
  ...(userType === 'SECRETARY'
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
  }
];

export default Menuitems;