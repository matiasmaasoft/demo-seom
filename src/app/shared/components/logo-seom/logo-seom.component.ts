import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo-seom',
  standalone: true,
  templateUrl: './logo-seom.component.html',
  styleUrl: './logo-seom.component.scss',
})
export class LogoSeomComponent {
  /** 'short' = solo "seom", 'full' = "MUTUAL seom" */
  variant = input<'short' | 'full'>('short');
}
