import React, { useMemo, useState } from 'react';
import { registerRootComponent } from 'expo';
import { Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import App from './App';
import { darkTheme, lightTheme } from './src/theme';
import { ThemeToggleContext } from './src/theme/context';

function Root() {
  const sys = useColorScheme();
  const [isDark, setIsDark] = useState(sys === 'dark');
  const theme = isDark ? darkTheme : lightTheme;
  const ctx = useMemo(() => ({ toggle: () => setIsDark((v) => !v) }), []);
  return (
    <ThemeToggleContext.Provider value={ctx}>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </ThemeToggleContext.Provider>
  );
}

registerRootComponent(Root);
