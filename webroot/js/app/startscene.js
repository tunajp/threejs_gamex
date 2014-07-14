/*
 * startscene.js
 * Start scene
 * (startscene->configscene->openingscene->testscene)
 *
 * @author Mitsunori Inaba <m-inaba@phoenixdesign.jp>
 */

module PXUtil from './util';
module PXConfig from './config';

/**
 * StartScene class
 */
export class StartScene
{
  /**
   * constructor
   */
  constructor(renderer)
  {
    PXUtil.trace_func('StartScene::constructor');

    //
    // private member
    //
    /** renderer */
    this.renderer;
    /** scene */
    this.scene;
    /** camera */
    this.camera;
    /** keyboard state */
    this.keyboard = new THREEx.KeyboardState();
    /** next scene */
    this.nextScene = "own";

    /*
     * initial process
     */
    this.renderer = renderer;

    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
    this.camera.position = new THREE.Vector3(0, 150, 500);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // 背景
    $(document.body).append('<div id="startscene_background"></div>');
    // mainbox
    $(document.body).append('<div id="startscene_mainbox"></div>');
    $('#startscene_mainbox').append('<h1 id="startscene_title">The Game</h1>');
    $('#startscene_mainbox').append('<p id="startscene_start">start</p>');
    $('#startscene_mainbox').append('<p id="startscene_load">load</p>');
    $('#startscene_mainbox').append('<p id="startscene_config">config</p>');

    // event
    $('#startscene_start').on('click', () => {
      this.start();
    });

    //PXUtil.myDialog('<div>タイトル</div><div><input id="title" value=""></input></div><div>本文</div><div><textarea id="msg"></textarea></div>', '投稿', 'OK', 'キャンセル', function(cancel){
    //});

    PXUtil.debug_board('complete');
  }

  /**
   * destructor method
   * 言語的にはないので、自分で呼ぶ
   */
  destructor()
  {
    this.scene = null;
    delete this.scene;
  }

  /**
   * getLoadingStatus method
   */
  getLoadingStatus()
  {
    return true; // complete
  }

  /**
   * getNextScene method
   */
  getNextScene()
  {
    return this.nextScene;
  }

  start()
  {
    $('#startscene_start').off();
    $('#startscene_background').remove();
    $('#startscene_mainbox').remove();
    this.nextScene = "openingscene";
  }

  /**
   * rendering method
   */
  rendering()
  {
    if (this.keyboard.pressed('up')) {
    }
    if (this.keyboard.pressed('down')) {
    }
    if (this.keyboard.pressed('enter')) {
      this.start();
    }
    this.renderer.render(this.scene, this.camera);
  }
  /**
   * resize method
   */
  resize()
  {
    PXUtil.trace_func('StartScene::resize');

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  /**
   * mousedown method
   */
  mousedown(e)
  {
  }
}
