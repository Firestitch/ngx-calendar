import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class HtmlClassRenderer {
  private _rendererFactory = inject(RendererFactory2);


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

  public addClass(cls) {
    this._renderer.addClass(document.documentElement, cls);
  }

  public removeClass(cls) {
    this.renderer.removeClass(document.documentElement, cls);
  }

}
