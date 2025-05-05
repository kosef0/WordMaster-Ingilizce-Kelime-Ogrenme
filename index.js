// sadece bir polyfill dosyasını import edelim
import './global.js';

// Expo'nun giriş noktasını import edelim
import { registerRootComponent } from 'expo';
import App from './App';

// Uygulamamızı kayıt edelim
registerRootComponent(App);