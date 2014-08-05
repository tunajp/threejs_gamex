/*
 * testscene.js
 *
 * @author Mitsunori Inaba <m-inaba@phoenixdesign.jp>
 */

import * as PXUtil from './util';
import * as PXConfig from './config';
import * as PXDebugbox from './objects/debugbox';
import * as PXShaderbox from './objects/shaderbox';
//import * as PXDebugfloor from './objects/debugfloor';
import * as PXTerrain from './objects/terrain';
import * as PXSkybox from './objects/skybox';
import * as PXRatamahatta from './objects/ratamahatta';

var _TEST_CONTROLLER_ = true;
var _CAN_JUMP_ = false;

/**
 * TestScene class
 */
export class TestScene
{
  /**
   * constructor
   */
  constructor(renderer)
  {
    PXUtil.trace_func('TestScene::constructor');

    //
    // private member
    //
    /** renderer */
    this.renderer;
    /** scene */
    this.scene;
    /** camera */
    this.camera;
    /** light */
    this.light;
    /** ambient light */
    this.ambient;
    /** items count */
    this.all_items = 6;
    /** load item count */
    this.loaded_items = 0;
    /** next scene */
    this.nextScene = "own";
    /** rendering target array */
    this.render_target_array = new Array();
    /** clock */
    this.clock;
    /** water */
    this.water = null;
    /** keyboard state */
    this.keyboard = new THREEx.KeyboardState();
    /** user_character */
    this.user_character = null;
    /** grounds collision array(下向き方向のあたり判定メッシュ配列:terrain,のれる建物) */
    this.grounds_collision_array = new Array();
    /** walls collision array(x,z方向のあたり判定メッシュ配列:建物,見えない壁) */
    this.walls_collision_array = new Array();
    this.mouseLook = {x:0 , y:0};
    /** control character */
    this.gravity = new THREE.Vector3(0, -10, 0);
    /** control character current animation */
    this.cur_anim_name = 'stand';
    /** control character attack animation */
    this.attack_delta = 0;
    /** 攻撃衝突判定用敵配列 */
    this.monsters_array = new Array();

    /*
     * initial process
     */
    this.renderer = renderer;

    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
    //this.camera.position.set(0, 150, 500);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // Light
    this.light = new THREE.SpotLight(0xffffff);
    this.light.position.set(100, 1000, 0);
    this.light.angle = Math.PI / 4;
    this.scene.add(this.light);

    // Ambient light
    //this.ambient = new THREE.AmbientLight(0x333333);
    //this.scene.add(this.ambient);

    // Shadow
    this.light.castShadow = true;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    this.light.shadowCameraNear = 100;
    this.light.shadowCameraFar = 1100;
    this.light.shadowCameraFov = 30;
    this.light.shadowCameraVisible = true; // 影生成カメラの表示(DEBUG)
    this.renderer.shadowMapEnabled = true;

    /*
     * mesh
     */
    this.loadObjects();

    // test用コントローラ
    if (_TEST_CONTROLLER_) {
      this.trackball = new THREE.TrackballControls(this.camera);
    }
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
   * rendering method
   */
  rendering()
  {
    if (_TEST_CONTROLLER_) {
      this.trackball.update();
    }

    var delta = this.clock.getDelta();
    if (delta > 1.0) return; // 落下防止
    
    /*
     * update
     */
    {
      if (this.attack_delta >= 0) this.attack_delta--;
      if (this.attack_delta < 0) {
        if (this.cur_anim_name == 'attack') {
          this.cur_anim_name = 'stand';
          this.user_character.setAnimation('stand');
        }
      }
      /*
       * 移動処理
       */
      var move = { xDist: 0, yAngle: 0, zDist: 0 };
      var moveDistance = 200 * delta; // 200 pixels per second  // should be velocity?
      var rotateAngle = Math.PI / 4 * delta;   // pi/4 radians (45 degrees) per second
      var moving = false; // 移動処理中フラグ

      if (this.keyboard.pressed('W')) {
        if (this.cur_anim_name != 'attack') { // attack中はのぞく
          PXUtil.trace_func('UP');
          if (this.cur_anim_name != 'run') {
            if (this.cur_anim_name != 'jump') { // jump中はのぞく
              this.cur_anim_name = 'run';
              this.user_character.setAnimation('run');
            }
          }
          move.zDist += moveDistance;
          moving = true;
        }
      }
      if (this.keyboard.pressed('A')) {
        if (this.cur_anim_name != 'attack') { // attack中はのぞく
          PXUtil.trace_func('LEFT');
          if (this.cur_anim_name != 'run') {
            if (this.cur_anim_name != 'jump') { // jump中はのぞく
              this.cur_anim_name = 'run';
              this.user_character.setAnimation('run');
            }
          }
          move.xDist += moveDistance;
          moving = true;
        }
      }
      if (this.keyboard.pressed('S')) {
        if (this.cur_anim_name != 'attack') { // attack中はのぞく
          PXUtil.trace_func('DOWN');
          if (this.cur_anim_name != 'run') {
            if (this.cur_anim_name != 'jump') { // jump中はのぞく
              this.cur_anim_name = 'run';
              this.user_character.setAnimation('run');
            }
          }
          move.zDist -= moveDistance;
          moving = true;
        }
      }
      if (this.keyboard.pressed('D')) {
        if (this.cur_anim_name != 'attack') { // attack中はのぞく
          PXUtil.trace_func('RIGHT');
          if (this.cur_anim_name != 'run') {
            if (this.cur_anim_name != 'jump') { // jump中はのぞく
              this.cur_anim_name = 'run';
              this.user_character.setAnimation('run');
            }
          }
          move.xDist -= moveDistance;
          moving = true;
        }
      }
      if (this.keyboard.pressed('Q')) {
        if (this.cur_anim_name != 'attack') { // attack中はのぞく
          PXUtil.trace_func('TURN LEFT');
          if (this.cur_anim_name != 'run') {
            if (this.cur_anim_name != 'jump') { // jump中はのぞく
              this.cur_anim_name = 'run';
              this.user_character.setAnimation('run');
            }
          }
          move.yAngle += rotateAngle;
          moving = true;
        }
      }
      if (this.keyboard.pressed('E')) {
        if (this.cur_anim_name != 'attack') { // attack中はのぞく
          PXUtil.trace_func('TURN RIGHT');
          if (this.cur_anim_name != 'run') {
            if (this.cur_anim_name != 'jump') { // jump中はのぞく
              this.cur_anim_name = 'run';
              this.user_character.setAnimation('run');
            }
          }
          move.yAngle -= rotateAngle;
          moving = true;
        }
      }

      // 何もしてなければstandアニメーション
      if (!moving && this.cur_anim_name != 'attack' && this.cur_anim_name != 'jump') {
        if (this.cur_anim_name != 'stand') {
          this.cur_anim_name = 'stand';
          this.user_character.setAnimation('stand');
        }
      }

      // process data from mouse look
      // (if inactive, there will be no change)
      move.yAngle -= rotateAngle * this.mouseLook.x * 0.1;
      this.mouseLook.x = 0;

      
      /*
       * キャラクタのx,z位置をセットして実際に動かす
       */
      var person = this.user_character.getRatamahatta();
      person.root.translateZ( move.zDist );
      person.root.rotateY( move.yAngle );
      person.root.translateX( move.xDist );
      person.root.updateMatrix();

      /*
       * x,z collision(壁判定)
       */
      var person_point_xz = new THREE.Vector3(person.root.position.x, person.root.position.y, person.root.position.z);
      var col = this.collision(person_point_xz, this.walls_collision_array);
      if (col) {
        /*
         * 壁に当たったので戻す
         */
        person.root.translateX( -move.xDist );
        person.root.rotateY( -move.yAngle );
        person.root.translateZ( -move.zDist );
        person.root.updateMatrix();
      }


      if (_CAN_JUMP_) {
        /*
         * ジャンプと接地についての処理
         */
        if (this.keyboard.pressed('space') && person.root.velocity.y == 0) {
          PXUtil.trace_func('JUMP');
          if (this.cur_anim_name != 'jump') {
            this.cur_anim_name = 'jump';
            this.user_character.setAnimation('jump');
          }
          person.root.velocity = new THREE.Vector3(0, 3, 0);
        }
        person.root.velocity.add( this.gravity.clone().multiplyScalar( delta ) );
        person.root.translateY( person.root.velocity.y );
        person.root.updateMatrix();
  
        var ray = new THREE.Raycaster();
        ray.ray.direction.set(0, -1, 0);
        // キャラクターの足元座標
        var person_step_area = new THREE.Vector3(person.root.position.x, person.root.position.y - /*72.8*/20.0, person.root.position.z);
        ray.ray.origin.copy( person_step_area );
        var intersects = ray.intersectObjects(this.grounds_collision_array);
        if (intersects.length > 0) {
          var distance = intersects[0].distance;
          console.log(distance);
          PXUtil.debug_board('delta: ' + delta + ' distance:' + distance + " point.y:" + intersects[0].point.y+ '<br>person x:' + person.root.position.x + " y:" + person.root.position.y + " z:" + person.root.position.z);
          if (distance > 0 && distance < 10) {
            // 地面またはオブジェクトにほぼ接地
            if (this.cur_anim_name == 'jump') {
              this.cur_anim_name = 'stand';
              this.user_character.setAnimation('stand');
            }
            person.root.translateY( -person.root.velocity.y );
            person.root.updateMatrix();
            person.root.velocity = new THREE.Vector3(0,0,0);
          } else {
          }
        } else {
          //PXUtil.debug_board('person x:' + person.root.position.x + " y:" + person.root.position.y + " z:" + person.root.position.z);
          PXUtil.debug_board('落下!');
        }
      }

      if (!_CAN_JUMP_) {
        /*
         * キャラクタのy座標設定
         * 本来ならばここでジャンプと接地処理になるがsimsのようなゲームならこのままでいい
         */
        var ray = new THREE.Raycaster();
        ray.ray.direction.set(0, -1, 0);
        // キャラクターのx,z座標(yはキャラの頭の位置ぐらいでいいかも,あまり低いと落下するかも)
        var person_point = new THREE.Vector3(person.root.position.x, person.root.position.y + 50, person.root.position.z);
        // 下にrayを出してキャラクタのいるべきy座標を得る
        ray.ray.origin.copy(person_point);
        var intersects = ray.intersectObjects(this.grounds_collision_array);
        if (intersects.length > 0) {
          //!一番初めにヒットしたy座標にキャラクタを移動する
          person.root.position.y = intersects[0].point.y + 25;
        }
      }

      // デバッグ表示
      //PXUtil.debug_board('delta: ' + delta + " point.y:" + intersects[0].point.y + '<br>person x:' + person.root.position.x + " y:" + person.root.position.y + " z:" + person.root.position.z);
      PXUtil.debug_board(
        'delta: ' + Math.floor(delta * 100000) / 100000 + '<br>' +
        '<br>person x:' + Math.floor(person.root.position.x * 100000) / 100000 +
        " y:" + Math.floor(person.root.position.y * 100000) / 100000 +
        " z:" + Math.floor(person.root.position.z * 100000) / 100000 + '<br>' +
        'info.memory.programs:' + this.renderer.info.memory.programs + '<br>' +
        'info.memory.geometries:' + this.renderer.info.memory.geometries + '<br>' +
        'info.memory.textures:' + this.renderer.info.memory.textures + '<br>' +
        'info.render.calls:' + this.renderer.info.render.calls + '<br>' +
        'info.render.vertices:' + this.renderer.info.render.vertices + '<br>' +
        'info.render.faces:' + this.renderer.info.render.faces + '<br>' +
        'info.render.points:' + this.renderer.info.render.points
        );

      /*
       * 影用のライトの位置を自キャラの近くに移動する
       */
      this.light.position.set(person.root.position.x, person.root.position.y + 1000, person.root.position.z);
      this.light.target.position.set(person.root.position.x, person.root.position.y-25, person.root.position.z);

      {
        if (person.root.position.x >=50 && person.root.position.x <=100
                && person.root.position.z >= 500 && person.root.position.z <=800) {
          this.nextScene = "threefieldscene";
        }
      }
    }


    for (var i=0; i<this.render_target_array.length; i++) {
      this.render_target_array[i].rendering(delta);
    }

    // water
    this.water.material.uniforms.time.value += 1.0/60.0;

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * collision(壁判定用)
   */
  collision(person_point, collision_array)
  {
    var ray = new THREE.Raycaster();

    // 手前
    ray.ray.direction.set(0, 0, -1);
    ray.ray.origin.copy(person_point);
    var intersects = ray.intersectObjects(collision_array);
    if (intersects.length > 0) {
      var distance = intersects[0].distance;
      if (distance > 0 && distance < 10) {
        //console.log('collision - true');
        return true;
      }
    }

    // 奥
    ray.ray.direction.set(0, 0, 1);
    ray.ray.origin.copy(person_point);
    var intersects = ray.intersectObjects(collision_array);
    if (intersects.length > 0) {
      var distance = intersects[0].distance;
      if (distance > 0 && distance < 10) {
        //console.log('collision - true');
        return true;
      }
    }

    // 左右
    ray.ray.direction.set(-1, 0, 0);
    ray.ray.origin.copy(person_point);
    var intersects = ray.intersectObjects(collision_array);
    if (intersects.length > 0) {
      var distance = intersects[0].distance;
      if (distance > 0 && distance < 10) {
        //console.log('collision - true');
        return true;
      }
    }

    // 左右
    ray.ray.direction.set(1, 0, 0);
    ray.ray.origin.copy(person_point);
    var intersects = ray.intersectObjects(collision_array);
    if (intersects.length > 0) {
      var distance = intersects[0].distance;
      if (distance > 0 && distance < 10) {
        //console.log('collision - true');
        return true;
      }
    }

    //console.log('collision - false');
    return false;
  }

  /**
   * loadObjects method
   */
  loadObjects()
  {
    /*
     * debug box
     */
    var debugbox = new PXDebugbox.Debugbox( (mesh) => {
      mesh.position.y += 70;
      this.scene.add(mesh);
      this.loadedIncrements();

      this.grounds_collision_array.push(mesh);
    });
    this.render_target_array.push(debugbox);
    /*
     * debug box2(collisionテスト用)
     */
    var debugbox2 = new PXDebugbox.Debugbox( (mesh) => {
      mesh.position.x = 83;
      mesh.position.y = 190;
      mesh.position.z = 716;
      this.scene.add(mesh);
      this.loadedIncrements();

      //this.grounds_collision_array.push(mesh);//乗れない判定にして壁として使ってみる
      this.walls_collision_array.push(mesh);
    });
    //this.render_target_array.push(debugbox2);//回してしまうとあたり判定がおかしくなる
    /*
     * shader load
     */
    SHADER_LOADER.load( (data) => {
      var myVertexShader1 = data.vertexShader.vertex; //data-name
      var myFragmentShader1 = data.fragmentShader.fragment; //data-name;
      /*
       * shaderbox
       */
      var shaderbox = new PXShaderbox.Shaderbox(myVertexShader1, myFragmentShader1, (mesh) => {
        mesh.position.y += 70;
        mesh.position.x += 120;
        this.scene.add(mesh);
        this.loadedIncrements();

      this.grounds_collision_array.push(mesh);
      });
      this.render_target_array.push(shaderbox);
    });
    //var debugfloor = new PXDebugfloor.Debugfloor( (mesh) => {
    //  this.scene.add(mesh);
    //  this.loadedIncrements();
    //});
    //this.render_target_array.push(debugfloor);

    /*
     * water
     */
    //load texture
    var waterNormals = new THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + 'water/waternormals.jpg');
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    // direction light add
    var directionalLight = new THREE.DirectionalLight(0xffff55, 1);
    directionalLight.position.set(-600, 300, 600);
    this.scene.add(directionalLight);

    this.water = new THREE.Water(this.renderer, this.camera, this.scene, {
      textureWidth: 256,
      textureHeight: 256,
      waterNormals: waterNormals,
      alpha: 	1.0,
      sunDirection: directionalLight.position.normalize(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      betaVersion: 0,
      side: THREE.DoubleSide,
			distortionScale: 50.0
    });
    var waterMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000*10, 2000*10, 100, 100), 
      this.water.material
    );
    waterMesh.position.y = -600;
    waterMesh.add(this.water);
    waterMesh.rotation.x = - Math.PI * 0.5;
    this.scene.add(waterMesh);

    /*
     * terrain
     */
    var terrain = new PXTerrain.Terrain( (mesh) => {
      this.scene.add(mesh);
      this.loadedIncrements();

      this.grounds_collision_array.push(mesh);
    });

    /*
     * skybox
     */
    var skybox = new PXSkybox.Skybox( (mesh) => {
      this.scene.add(mesh);
      this.loadedIncrements();
    });

    /*
     * character
     */
    this.user_character = new PXRatamahatta.Ratamahatta(1, (mesh, obj) => {
      mesh.position.y += 1000;
      mesh.name = "player";
      this.scene.add(mesh);

      // bihind camera
      this.camera.position.z = /*-400*/-50;
      this.camera.position.y = /*200*/30;
      //this.camera.position.x = 20;
      //this.camera.lookAt(mesh.position);
      this.camera.lookAt(new THREE.Vector3(0,20,0));
      mesh.add(this.camera);

      mesh.velocity = new THREE.Vector3(0, 0, 0);

      this.loadedIncrements();
    });
    this.render_target_array.push(this.user_character);
  }

  /**
   * resize method
   */
  resize()
  {
    PXUtil.trace_func('TestScene::resize');

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  /**
   * mousedown method
   */
  mousedown(e)
  {
    if (this.cur_anim_name != 'attack') {
      this.cur_anim_name = 'attack';
      this.user_character.setAnimation('attack');
      this.attack_delta = 20;

      /*
       * 攻撃衝突判定
       */
      {
        var projector = new THREE.Projector();
        var rect = e.target.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        mouseX =  (mouseX/window.innerWidth)  * 2 - 1;
        mouseY = -(mouseY/window.innerHeight) * 2 + 1;
        //this.camera.matrixWorldNeedsUpdate = true;
        //this.camera.updateMatrixWorld(true);
        //http://stackoverflow.com/questions/14211627/three-js-how-to-get-position-of-a-meshよりワールド座標の取得
        this.scene.updateMatrixWorld(true);
        var cam_position = new THREE.Vector3();
        //cam_position.getPositionFromMatrix( this.camera.matrixWorld );
        cam_position.setFromMatrixPosition( this.camera.matrixWorld );
        //alert(position.x + ',' + position.y + ',' + position.z);

        console.log(mouseX + "," + mouseY + "/" + this.camera.position.x + "," + this.camera.position.y + "," + this.camera.position.z);// カメラはローカル座標のようだ
        var pos = new THREE.Vector3(mouseX, mouseY, 1);
        projector.unprojectVector(pos, this.camera);
        var ray = new THREE.Raycaster(cam_position, pos.sub(cam_position).normalize());

        for (var i=0; i<this.monsters_array.length; i++) {
          var monster_character = this.monsters_array[i].getRatamahatta();

          var intersects = ray.intersectObjects(monster_character.root.children);
          if (intersects.length > 0) {
            console.log('何かにあたった' + monster_character.root.name);
          }
        }

      }
    }
  }
}
