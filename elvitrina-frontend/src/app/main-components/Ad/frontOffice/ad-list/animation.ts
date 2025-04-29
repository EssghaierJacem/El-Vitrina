import { trigger, transition, style, animate, state } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  state('void', style({
    opacity: 0,
    transform: 'translateY(10px)'
  })),
  transition('void <=> *', [
    animate('0.4s cubic-bezier(0.2, 1, 0.3, 1)')
  ])
]);

export const pinReveal = trigger('pinReveal', [
  transition(':enter', [
    style({ 
      opacity: 0, 
      transform: 'translateY(30px) scale(0.9)' 
    }),
    animate('0.6s cubic-bezier(0.2, 1, 0.3, 1)', style({ 
      opacity: 1, 
      transform: 'translateY(0) scale(1)' 
    }))
  ])
]);

export const staggeredFade = trigger('staggeredFade', [
  transition('* => *', [
    style({ opacity: 0 }),
    animate('0.8s cubic-bezier(0.2, 1, 0.3, 1)', style({ opacity: 1 }))
  ])
]);