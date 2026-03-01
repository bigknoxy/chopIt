import { Game } from './game';
import './style.css';

let game: Game | null = null;

async function init() {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas not found');
    return;
  }

  game = new Game(canvas);
  await game.init();

  console.log('Chop it like it\'s HAWT initialized!');
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('beforeunload', () => {
  if (game) {
    game.destroy();
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('ServiceWorker registration failed:', err);
    });
  });
}
