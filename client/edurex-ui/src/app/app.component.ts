import { Component } from '@angular/core';
import {HostBinding} from '@angular/core'
import {OverlayContainer} from '@angular/cdk/overlay'
import { LocalStorageService } from './shared/services/local-storage.service';

const THEME_DARKNESS_SUFFIX = `-dark`

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'VES|BLOBTECH';
  @HostBinding('class') activeThemeCssClass: string
  isThemeDark = false
  activeTheme: string
  defaultTheme = 'teal-cyan';
  
  constructor(private overlayContainer: OverlayContainer,private localStorageService : LocalStorageService) {
    // Set default theme here:
    if(this.localStorageService.getter('theme') != null)
    {
      this.defaultTheme = this.localStorageService.getter('theme');
    }
    if(this.localStorageService.getter('dark-mode') != null)
    {
      this.setActiveTheme(this.defaultTheme, /* darkness: */ JSON.stringify(this.localStorageService.getter('dark-mode')) == "true" ? true : false);
    }
    else
    {
      this.setActiveTheme(this.defaultTheme, /* darkness: */ false);
    }
  }
  
  setActiveTheme(theme: string, darkness: boolean = null) {
    if (darkness === null)
      darkness = this.isThemeDark
    else if (this.isThemeDark === darkness) {
      if (this.activeTheme === theme) return
    } else
      this.isThemeDark = darkness
    
    this.activeTheme = theme
    
    const cssClass = darkness === true ? theme + THEME_DARKNESS_SUFFIX : theme
    
    const classList = this.overlayContainer.getContainerElement().classList
    if (classList.contains(this.activeThemeCssClass))
      classList.replace(this.activeThemeCssClass, cssClass)
    else
      classList.add(cssClass)
    
    this.activeThemeCssClass = cssClass
  }

  toggleDarkness() {
    this.setActiveTheme(this.activeTheme, !this.isThemeDark);
    this.localStorageService.setter("dark-mode", !this.isThemeDark ? JSON.parse("false") : JSON.parse("true"));
    
  }
   
  
  
  
}
