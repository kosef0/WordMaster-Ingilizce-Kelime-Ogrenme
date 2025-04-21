// İlk olarak polyfill'i import edelim
import './setImmediatePolyfill.js';

// Expo'nun giriş noktasını import edelim
import { registerRootComponent } from 'expo';
import App from './App';

// Uygulamamızı kayıt edelim
registerRootComponent(App);