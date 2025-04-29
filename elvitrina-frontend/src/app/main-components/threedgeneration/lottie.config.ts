// Alternative import if the above doesn't work
import { ɵLOTTIE_OPTIONS as LOTTIE_OPTIONS } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player;
}

export const LottieConfiguration = {
  provide: LOTTIE_OPTIONS,
  useValue: {
    player: playerFactory,
    renderer: 'svg',
    loop: true,
    autoplay: true
  }
};