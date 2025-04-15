import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AdDisplayComponent } from "../../main-components/Ad/frontOffice/ad-display/ad-display.component";

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: [],
  imports: [RouterOutlet, MaterialModule, CommonModule, AdDisplayComponent],
})
export class BlankComponent {
  private htmlElement!: HTMLHtmlElement;

  options = this.settings.getOptions();

  constructor(private settings: CoreService) {
    this.htmlElement = document.querySelector('html')!;
  }


}
