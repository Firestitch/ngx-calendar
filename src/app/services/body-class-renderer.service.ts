import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import {
  ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, NavigationStart, Router,
} from '@angular/router';

import { filter } from 'rxjs/operators';


@Injectable()
export class BodyClassRenderer {
  private _router = inject(Router);
  private _rendererFactory = inject(RendererFactory2);
  private _route = inject(ActivatedRoute);


  private _bodyClassListener;
  private _renderer: Renderer2;

  constructor() {
    const _rendererFactory = this._rendererFactory;

    this._renderer = _rendererFactory.createRenderer(null, null);
  }

  public get renderer() {
    return this._renderer;
  }

  public set renderer(val) {
    this._renderer = val;
  }

  public destroy() {
    if (this._bodyClassListener) {
      this._bodyClassListener.unsubscribe();
    }
  }

  public addClass(cls) {
    this._renderer.addClass(document.body, cls);
  }

  public removeClass(cls) {
    this.renderer.removeClass(document.body, cls);
  }

  public addBodyClass(cls) {
    this.addClass(this._sanitizeClass(cls));
  }

  public removeBodyClass(cls) {
    this.removeClass(this._sanitizeClass(cls));
  }

  public init() {
    this._bodyClassListener = this._router
      .events
      .pipe(
        filter( (event) => event instanceof NavigationEnd || event instanceof NavigationStart),
      )
      .subscribe((event) => {
        document.body.className.split(' ')
          .forEach((name) => {
            if (name.match(/^body-/)) {
              this.removeBodyClass(name);
            }
          });

        this._getBodyClasses(this._route.snapshot.firstChild)
          .forEach((cls) => {
            this.addBodyClass(cls);
          });
      });
  }

  private _getBodyClasses(activatedRoute: ActivatedRouteSnapshot) {
    const bodyClasses = [];
    if (activatedRoute) {
      if (activatedRoute.data && activatedRoute.data.bodyClass) {
        bodyClasses.push(...this._parseBodyClasses(activatedRoute.data.bodyClass));
      }

      if (activatedRoute.firstChild) {
        bodyClasses.push(...this._getBodyClasses(activatedRoute.firstChild));
      }
    }

    return bodyClasses;
  }

  private _parseBodyClasses(data) {
    return data.split(/[\s,]/).filter(Boolean);
  }

  private _sanitizeClass(cls) {

    if (cls.indexOf('body-') === -1) {
      return `body-${  cls}`;
    }

    return cls;
  }
}
