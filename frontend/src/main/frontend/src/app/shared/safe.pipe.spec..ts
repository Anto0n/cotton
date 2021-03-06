/**
 * Created by Anton on 18-Apr-17.
 */
import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl} from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}
  transform(url) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public transformAll(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this._sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this._sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this._sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this._sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this._sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`Unable to bypass security for invalid type: ${type}`);
    }
  }
}


/*
constructor(protected _sanitizer: DomSanitization) {

}

public transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
  switch (type) {
    case 'html':
      return this._sanitizer.bypassSecurityTrustHtml(value);
    case 'style':
      return this._sanitizer.bypassSecurityTrustStyle(value);
    case 'script':
      return this._sanitizer.bypassSecurityTrustScript(value);
    case 'url':
      return this._sanitizer.bypassSecurityTrustUrl(value);
    case 'resourceUrl':
      return this._sanitizer.bypassSecurityTrustResourceUrl(value);
    default:
      throw new Error(`Unable to bypass security for invalid type: ${type}`);
  }
}
*/
