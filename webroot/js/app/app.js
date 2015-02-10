/*
 * app.js
 *
 * @author Mitsunori Inaba <m-inaba@phoenixdesign.jp>
 */


import * as PXUtil from './util.js';
import * as PXConfig from './config.js';
import * as PXStartScene from './startscene.js';
import * as PXOpeningScene from './openingscene.js';
import * as PXTestScene from './testscene.js';
import * as PXThreefieldScene from './threefieldscene.js';

/**
 * Application class
 */
class Application
{
  /**
   * constructor
   */
  constructor()
  {
    PXUtil.trace_func('App::constructor');

    //
    // private member
    //
    /** renderer */
    this.renderer;
    /** stats */
    this.stats;
    /** currentSceneObject */
    this.currentSceneObject;

    /*
     * renderer
     */
    this.renderer = Detector.webgl ? new THREE.WebGLRenderer({antialias: true}) : new THREE.CanvasRenderer();
    if (Detector.webgl) {
      PXUtil.webgl_info(this.renderer);
    } else {
    }
    var width = window.innerWidth;
    var height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x00000, 1);
    document.getElementById('canvas').appendChild(this.renderer.domElement);

    /*
     * set stats
     */
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.stats.domElement.style.zIndex = 100;
    document.body.appendChild(this.stats.domElement);

    /*
     * debug_board
     */
    if (PXConfig._DEBUG_MODE_) {
      $(document.body).append('<div id="debug_board" width="200" height="200">test<br>test2<br>test3<br></div>');
    }

    PXUtil.debug_board('Now Loading...');

    /*
     * scene作成
     */
    this.currentSceneObject = new PXStartScene.StartScene(this.renderer);

    /*
     * eventハンドラ登録
     */
    this.resize();
    this.mouseevent();
  }
  /**
   * run method
   */
  run()
  {
    PXUtil.trace_func('App::run');

    this.update();
  }
  /**
   * update method
   */
  update()
  {
    var nextScene = this.currentSceneObject.getNextScene();
    if ("own" !== nextScene) {
      PXUtil.debug_board('Now Loading...');
      switch(nextScene) {
        case "startscene":
          this.currentSceneObject.destructor();
          this.currentSceneObject = null;
          this.currentSceneObject = new PXStartScene.StartScene(this.renderer);
          break;
        case "openingscene":
          this.currentSceneObject.destructor();
          this.currentSceneObject = null;
          this.currentSceneObject = new PXOpeningScene.OpeningScene(this.renderer);
          break;
        case "testscene":
          this.currentSceneObject.destructor();
          this.currentSceneObject = null;
          this.currentSceneObject = new PXTestScene.TestScene(this.renderer);
          break;
        case "threefieldscene":
          this.currentSceneObject.destructor();
          this.currentSceneObject = null;
          this.currentSceneObject = new PXThreefieldScene.ThreefieldScene(this.renderer);
          break;
      }
    }
    this.rendering();
    
    // レンダリングするたびにFPSを計測
    this.stats.update();
  }
  /**
   * rendering method
   */
  rendering()
  {
    if (PXConfig._FPS_ === 60) {
      requestAnimationFrame( () => {
        this.update();
      });
    } else {
      setTimeout( () => {
        requestAnimationFrame( () => {
          this.update();
        });
      }, 1000/PXConfig._FPS_);
    }

    if (this.currentSceneObject.getLoadingStatus() === true) {
      this.currentSceneObject.rendering();
    }
  }
  /**
   * resize method
   */
  resize()
  {
    PXUtil.trace_func('App::resize');

    $(window).resize( (e) => {
      var w = window.innerWidth;
      var h = window.innerHeight;
      PXUtil.trace_func('App::resize::resize w:' + w + ',h:' + h);

      this.renderer.setSize(w, h);
      this.currentSceneObject.resize();
    });
  }

  /**
   * mouseevent method
   */
  mouseevent()
  {
    $(document).mousedown( (e) => {
      PXUtil.trace_func('App::mouseevent::mousedown - type'+ e.type);
      this.currentSceneObject.mousedown(e);
    });
  }
}

/*
 * entry point
 */
$( () => {
  /*
   * i18n init
   */
  PXUtil.i18nLoad( () => {
    PXUtil.trace_func($.i18n.t('app.i18nLoadComplete'));
    /*
     * application start
     */
    var app = new Application();
    app.run();
  });
});
