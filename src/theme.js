
import { createTheme } from '@mui/material/styles';

// Paleta de Cores:
// 70% cores neutras (cinza / branco)
// 20% azul primário
// 10% dourado/destaques
let theme = createTheme({
  palette: {
    primary: {
      main: '#1E3A8A', // Azul Escuro (Confiança & Tecnologia)
    },
    secondary: {
      main: '#111827', // Cinza Escuro / Carvão (Barbearia & Elegância)
    },
    background: {
      default: '#F3F4F6', // Fundo Principal – Cinza Claro Neutro
      paper: '#FFFFFF',    // Cartões / Containers
    },
    success: {
      main: '#16A34A',
    },
    error: {
      main: '#DC2626',
    },
    warning: {
      main: '#F59E0B', // Dourado Suave (Premium & Ação)
    },
    text: {
        primary: '#111827',
        secondary: '#6B7280',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
        fontWeight: 700,
    },
    h2: {
        fontWeight: 700,
    },
    h3: {
        fontWeight: 700,
    },
    h4: {
        fontWeight: 600,
    },
    h5: {
        fontWeight: 600,
    },
     button: {
      textTransform: 'none', // Botões mais subtis
      fontWeight: '600',
    },
  },
  shape: {
      borderRadius: 8, // Bordas ligeiramente mais suaves
  },
  components: {
      MuiCard: {
          styleOverrides: {
              root: {
                  elevation: 1, // Sombra padrão mais subtil
              }
          }
      }
  }
});

export default theme;
