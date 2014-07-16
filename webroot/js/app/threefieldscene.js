/*
 * threefieldscene.js
 *
 * @author Mitsunori Inaba <m-inaba@phoenixdesign.jp>
 */

module PXUtil from './util';
module PXConfig from './config';
module PXDebugbox from './objects/debugbox';
module PXShaderbox from './objects/shaderbox';
module PXTerrain from './objects/terrain';
module PXSkybox from './objects/skybox';
module PXRatamahatta from './objects/ratamahatta';
module PXDebugfloor from './objects/debugfloor';

//threefield.jsで以下修正
//var jumpMaxDuration = 700;//1000;

/**
 * ThreefieldScene class
 */
export class ThreefieldScene
{
  /**
   * constructor
   */
  constructor(renderer)
  {
    PXUtil.trace_func('ThreefieldScene::constructor');

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
    /** items_count */
    this.all_items = 5;
    /** load item count */
    this.loaded_items = 0;
    /** next scene */
    this.nextScene = "own";
    /** rendering target array */
    this.render_target_array = new Array();
    /** clock */
    this.clock;
    this.attack_delta = 0;

    /** */
    this.player_mesh;

    /*
     * initial process
     */
    this.renderer = renderer;

    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
    this.camera.position.set(0, 150, 500);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();


    // Light
    this.light = new THREE.SpotLight(0xffffff);
    this.light.position.set(100, 1000/2, 0);
    this.light.angle = Math.PI / 4;
    this.scene.add(this.light);

    // Ambient light
    this.ambient = new THREE.AmbientLight(0x333333);
    this.scene.add(this.ambient);

    // Shadow
    this.light.castShadow = true;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    this.light.shadowCameraNear = 10;
    this.light.shadowCameraFar = 100;
    this.light.shadowCameraFov = 30;
    this.light.shadowCameraVisible = true; // 影生成カメラの表示(DEBUG)
    this.renderer.shadowMapEnabled = true;

    /*
     * physics
     */
    this.world = new THREEFIELD.World();
    this.playerObjectHolder = new THREE.Object3D();
    this.playerObjectHolder.position.set(0, 100, 0);
    this.scene.add(this.playerObjectHolder);

    var playerRadius = 1; // 半径(物体の大きさに合わせる事)
    this.playerController = new THREEFIELD.CharacterController(this.playerObjectHolder, playerRadius, this.world);
    //this.playerController.movementSpeed = 20;

    /*
     * KeyInputControl
     */
    this.keyInputControl = new THREEFIELD.KeyInputControl();
    this.keyInputControl.addEventListener('movekeyhold', () => {
      this.playerController.isWalking = true;
    });
    this.keyInputControl.addEventListener('movekeyrelease', () => {
      this.playerController.isWalking = false;
    });
    this.keyInputControl.addEventListener('jumpkeypress', ()  => {
      this.playerController.jump();
    });
    this.playerController.addEventListener('startIdling',  () => {
      this.user_character.setAnimation('stand');
    });
    this.playerController.addEventListener('startWalking', () => {
      this.user_character.setAnimation('run');
    });
    this.playerController.addEventListener('startJumping', () => {
      this.user_character.setAnimation('jump');
    });


    this.gyroscopeCameraControl = new THREEFIELD.GyroscopeCameraControl(
      this.camera,
      this.playerObjectHolder,
      {
        el: this.renderer.domElement,
        offset: new THREE.Vector3( 0, 6, 0 ), // eye height
        radius: 20,
        //minRadius: 100,
        //maxRaduis: 1000
      }
    );

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
    var delta = this.clock.getDelta();

    var cameraFrontAngle = this.gyroscopeCameraControl.getFrontAngle();
    var characterFrontAngle = this.keyInputControl.getFrontAngle();
    this.playerController.frontAngle = ( 360 - cameraFrontAngle ) + characterFrontAngle % 360; // Wの前進方向
    this.player_mesh.rotation.y = THREE.Math.degToRad( ( 360 - cameraFrontAngle ) + characterFrontAngle % 360 ) + Math.PI;// これでキャラ回転
    this.gyroscopeCameraControl.update();
    this.world.step(delta);

    /*
     * 影用のライトの位置を自キャラの近くに移動する
     */
    this.light.position.set(this.playerController.object.position.x, this.playerController.object.position.y + 90, this.playerController.object.position.z);
    this.light.target.position.set(this.playerController.object.position.x, this.playerController.object.position.y-25, this.playerController.object.position.z);


    if (this.attack_delta >= 0) this.attack_delta--;
    if (this.attack_delta < 0) {
      if (this.user_character.getAnimation() == 'attack') {
        if (this.playerController.isWalking) {
          this.user_character.setAnimation('run');
        } else {
          this.user_character.setAnimation('stand');
        }
      }
    }

    for (var i=0; i<this.render_target_array.length; i++) {
      this.render_target_array[i].rendering(delta);
    }

    PXUtil.debug_board('delta: ' + delta + '<br>person x:' + this.playerController.object.position.x + " y:" + this.playerController.object.position.y + " z:" + this.playerController.object.position.z);

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * loadObjects method
   */
  loadObjects()
  {
    var debugbox = new PXDebugbox.Debugbox( (mesh) => {
      //mesh.position.y += 70;
      this.scene.add(mesh);

      // physics
      var groundBody = new THREEFIELD.Collider(mesh);
      this.world.add(groundBody);

      this.loadedIncrements();
    });
    //this.render_target_array.push(debugbox);
    /*
     * shader load
     */
    SHADER_LOADER.load( (data) => {
      var myVertexShader1 = data.vertexShader.vertex; //data-name
      var myFragmentShader1 = data.fragmentShader.fragment; //data-name;
      var shaderbox = new PXShaderbox.Shaderbox(myVertexShader1, myFragmentShader1, (mesh) => {
        mesh.position.y += 70;
        mesh.position.x += 120;
        this.scene.add(mesh);
        this.loadedIncrements();
      });
      this.render_target_array.push(shaderbox);
    });
    //var debugfloor = new PXDebugfloor.Debugfloor( (mesh) => {
    //  this.scene.add(mesh);

    //  // physics
    //  var groundBody = new THREEFIELD.Collider(mesh);
    //  this.world.add(groundBody);

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
      alpha: 	0.5/*1.0*/,
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

      // physics
      var groundBody = new THREEFIELD.Collider(mesh);
      this.world.add(groundBody);
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
    this.user_character = new PXRatamahatta.Ratamahatta(1/10, (mesh, obj) => {
      //mesh.position.y += 1000;
      mesh.position.y -= 1;

      mesh.name = "player";
      this.scene.add(mesh);

      this.playerObjectHolder.add(mesh);
      this.player_mesh = mesh;

      // 初期位置
      this.playerController.object.position.x = 83;
      this.playerController.object.position.y = 200;
      this.playerController.object.position.z = 716;

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
    if (this.user_character.getAnimation() != 'attack') {
      this.user_character.setAnimation('attack');
      this.attack_delta = 20;
    }
  }
}
