import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const brandPrimary = '#6750A4';
const brandSecondary = '#625B71';
const error = '#B3261E';

export const lightTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandPrimary,
    secondary: brandSecondary,
    background: '#F6F7FB',
    surface: '#FFFFFF',
    error,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: brandPrimary,
    secondary: brandSecondary,
    background: '#0F1115',
    surface: '#151923',
    error,
  },
};

