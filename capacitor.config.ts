import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5b04091f023b4aae8ccd0ec4e1c2e31e',
  appName: 'Decifra - Lógica de Programação',
  webDir: 'dist',
  server: {
    url: 'https://5b04091f-023b-4aae-8ccd-0ec4e1c2e31e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a2e'
    }
  }
};

export default config;