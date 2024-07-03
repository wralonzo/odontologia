import { IconLayoutDashboard, IconUser } from '@tabler/icons';
import { uniqueId } from 'lodash';

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
  {
    id: uniqueId(),
    title: 'Usuarios',
    icon: IconUser,
    href: '/users'
  },
  {
    id: uniqueId(),
    title: 'Pacientes',
    icon: IconUser,
    href: '/patients'
  }
];

export default Menuitems;