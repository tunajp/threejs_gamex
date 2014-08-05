/*
 * openingscene.js
 * Opening scene
 * (startscene->configscene->openingscene->testscene)
 *
 * @author Mitsunori Inaba <m-inaba@phoenixdesign.jp>
 */

import * as PXUtil from './util';
import * as PXConfig from './config';
import * as PXRatamahatta from './objects/ratamahatta';

/**
 * OpeningScene class
 */
export class OpeningScene
{
  /**
   * constructor
   */
  constructor(renderer)
  {
    PXUtil.trace_func('OpeningScene::constructor');

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
    /** items count */
    this.all_items = 1;
    /** load item count */
    this.loaded_items = 0;
    /** rendering target array */
    this.render_target_array = new Array();

    /*
     * initial process
     */
    this.renderer = renderer;

    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
    this.camera.position.set(-20, 10, 500/2);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // Light
    this.light = new THREE.SpotLight(0xffffff);
    this.light.position.set(100, 1000, 0);
    this.light.angle = Math.PI / 4;
    this.scene.add(this.light);

    // Shadow
    this.light.castShadow = true;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    this.light.shadowCameraNear = 100;
    this.light.shadowCameraFar = 1100;
    this.light.shadowCameraFov = 30;
    this.light.shadowCameraVisible = false; // 影生成カメラの表示(DEBUG)
    this.renderer.shadowMapEnabled = true;

    // storybox
    $(document.body).append('<div id="openingscene_storybox"></div>');
    $('#openingscene_storybox').append('<div>story...</div>');
    $('#openingscene_storybox').append('<div>昔々、あるところにおじいさんとおばあさんが住んでいました。</div>');
    $('#openingscene_storybox').append('<div>おじいさんは芝刈りに、おばあさんは川に洗濯にいきました。</div>');
    $('#openingscene_storybox').append('<div>おばあさんが川で洗濯をしていると、ドンブラコ、ドンブラコと、大きな桃が流れてきました。</div>');
    $('#openingscene_storybox').append('<div>おじいさんとおばあさんが桃を食べようと切ってみると、なんと中から銃をもった小さな緑の男の子が現れました。</div>');
    $('#openingscene_storybox').append('<div>子どものいなかったおじいさんとおばあさんは、大喜びです。</div>');
    $('#openingscene_storybox').append('<div>桃から生まれた男の子を、おじいさんとおばあさんは桃太郎と名付けました。</div>');
    $('#openingscene_storybox').append('<div>桃太郎はスクスク育って、やがて強い男の子になりました。</div>');
    $('#openingscene_storybox').append('<div>そしてある日、桃太郎が言いました。</div>');
    $('#openingscene_storybox').append('<div>「ぼく、鬼ヶ島へ行って、わるい鬼を退治します」</div>');

    /*
     * mesh
     */
    this.loadObjects();

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
    if (this.all_items === this.loaded_items || this.loading == false) {
      PXUtil.debug_board('complete');
      return true; // complete
    } else {
      return false; // loading
    }
  }

  /**
   * loadedIncrements method
   */
  loadedIncrements()
  {
    this.loaded_items++;
    if (this.loaded_items === this.all_items) {
      this.loading = false;

      // ロード完了のこのタイミングでタイマーを開始
      this.clock = new THREE.Clock();
    }
  }

  /**
   * getNextScene method
   */
  getNextScene()
  {
    return this.nextScene;
  }

  /**
   * start method
   */
  start()
  {
    $('#openingscene_storybox').remove();
    this.nextScene = "testscene";
  }

  /**
   * rendering method
   */
  rendering()
  {
    var delta = this.clock.getDelta();

    if (this.keyboard.pressed('enter')) {
      this.start();
    }

    for (var i=0; i<this.render_target_array.length; i++) {
      this.render_target_array[i].rendering(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }
  /**
   * loadObjects method
   */
  loadObjects()
  {
    /*
     * character
     */
    this.user_character = new PXRatamahatta.Ratamahatta(1, (mesh, obj) => {
      //mesh.position.y += 1000;
      mesh.name = "player";
      this.scene.add(mesh);

      this.loadedIncrements();
    });
    this.render_target_array.push(this.user_character);
  }

  /**
   * resize method
   */
  resize()
  {
    PXUtil.trace_func('OpeningScene::resize');

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  /**
   * mousedown method
   */
  mousedown(e)
  {
    this.start();
  }
}
