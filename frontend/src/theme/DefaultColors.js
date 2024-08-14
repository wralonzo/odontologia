import { createTheme } from "@mui/material/styles";
import typography from "./Typography";
import { shadows } from "./Shadows";

const baselightTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: { main: '#5D87FF', light: '#ECF2FF', dark: '#4570EA' },
    secondary: { main: '#49BEFF', light: '#E8F7FF', dark: '#23afdb' },
    success: { main: '#13DEB9', light: '#E6FFFA', dark: '#02b3a9', contrastText: '#ffffff' },
    info: { main: '#539BFF', light: '#EBF3FE', dark: '#1682d4', contrastText: '#ffffff' },
    error: { main: '#FA896B', light: '#FDEDE8', dark: '#f3704d', contrastText: '#ffffff' },
    warning: { main: '#FFAE1F', light: '#FEF5E5', dark: '#ae8e59', contrastText: '#ffffff' },
    purple: { A50: '#EBF3FE', A100: '#6610f2', A200: '#557fb9' },
    grey: { 100: '#F2F6FA', 200: '#EAEFF4', 300: '#DFE5EF', 400: '#7C8FAC', 500: '#5A6A85', 600: '#2A3547' },
    text: { primary: '#2A3547', secondary: '#5A6A85' },
    action: { disabledBackground: 'rgba(73,82,88,0.12)', hoverOpacity: 0.02, hover: '#f6f9fc' },
    divider: '#e5eaef',
  },
  typography,
  shadows
},
);

const basedarkTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1', light: '#f6a5c0', dark: '#aa647b' },
    success: { main: '#81c784', light: '#a7d3a6', dark: '#4b8c57', contrastText: '#ffffff' },
    info: { main: '#64b5f6', light: '#8abfe8', dark: '#2286c3', contrastText: '#ffffff' },
    error: { main: '#f44336', light: '#e57373', dark: '#d32f2f', contrastText: '#ffffff' },
    warning: { main: '#ffb74d', light: '#ffcc80', dark: '#f57c00', contrastText: '#ffffff' },
    purple: { A50: '#f3e5f5', A100: '#d500f9', A200: '#aa00ff' },
    grey: { 100: '#f5f5f5', 200: '#eeeeee', 300: '#e0e0e0', 400: '#bdbdbd', 500: '#9e9e9e', 600: '#757575' },
    text: { primary: '#ffffff', secondary: '#bdbdbd' },
    action: { disabledBackground: 'rgba(255, 255, 255, 0.12)', hoverOpacity: 0.08, hover: '#616161' },
    divider: '#bdbdbd',
  },
  typography,
  shadows,
});

export { baselightTheme, basedarkTheme };