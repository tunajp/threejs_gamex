System.register("config", [], function() {
  "use strict";
  var __moduleName = "config";
  var _DEBUG_MODE_ = true;
  var _FPS_ = 60;
  var _ASSETS_PATH_ = "js/app/assets/";
  return {
    get _DEBUG_MODE_() {
      return _DEBUG_MODE_;
    },
    get _FPS_() {
      return _FPS_;
    },
    get _ASSETS_PATH_() {
      return _ASSETS_PATH_;
    }
  };
});
System.register("util", [], function() {
  "use strict";
  var __moduleName = "util";
  var PXConfig = System.get("config");
  function trace_func(str) {
    if (PXConfig._DEBUG_MODE_) {
      var d = new Date();
      var hh = d.getHours();
      var mm = d.getMinutes();
      var ss = d.getSeconds();
      var dd = d.getMilliseconds();
      var log_time = hh + ":" + mm + ":" + ss + ":" + dd;
      console.log(log_time + " " + str);
    }
  }
  function debug_board(str) {
    'use strict';
    if (PXConfig._DEBUG_MODE_) {
      var d = new Date();
      var hh = d.getHours();
      var mm = d.getMinutes();
      var ss = d.getSeconds();
      var dd = d.getMilliseconds();
      var log_time = hh + ":" + mm + ":" + ss + ":" + dd;
      $('#debug_board').html(log_time + ' ' + str);
    }
  }
  function webgl_info(renderer) {
    var gl = renderer.context;
    var gl_info = {
      "Version": gl.getParameter(gl.VERSION),
      "Shading language": gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      "Vendor": gl.getParameter(gl.VENDOR),
      "Renderer": gl.getParameter(gl.RENDERER),
      "Max varying vectors": gl.getParameter(gl.MAX_VARYING_VECTORS),
      "Max vertex attribs": gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
      "Max vertex uniform vectors": gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
      "Max fragment uniform vectors": gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      "Max renderbuffer size": gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      "Max texture size": gl.getParameter(gl.MAX_TEXTURE_SIZE),
      "Max cube map texture size": gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
      "Max texture image units": gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
      "Max vertex texture units": gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      "Max combined texture units": gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
      "Max viewport dims": gl.getParameter(gl.MAX_VIEWPORT_DIMS)[0] + "x" + gl.getParameter(gl.MAX_VIEWPORT_DIMS)[1]
    };
    console.log("WebGL info: ", gl_info);
  }
  function screenshot(dontDownload, useJPG) {
    var imgtype = useJPG ? "image/jpeg" : "image/png";
    var dataUrl = renderer.domElement.toDataURL(imgtype);
    if (!dontDownload)
      dataUrl = dataUrl.replace(imgtype, "image/octet-stream");
    window.open(dataUrl, "_blank");
  }
  var Hoge = function Hoge() {};
  ($traceurRuntime.createClass)(Hoge, {hoge: function(x) {
      console.log('Hoge::hoge');
    }}, {});
  function confirmDialog(message, title, buttonok, buttoncancel, response) {
    var _dlg = $('<div>' + message + '</div>');
    var _buttons = {};
    _buttons[buttonok] = function() {
      $(this).dialog('close');
      response(false);
      $(this).dialog('destroy');
    };
    _buttons[buttoncancel] = function() {
      $(this).dialog('close');
      response(true);
      $(this).dialog('destroy');
    };
    _dlg.dialog({
      modal: true,
      draggable: true,
      title: title,
      height: 180,
      width: 500,
      buttons: _buttons,
      open: function() {
        var closeBtn = $('.ui-dialog-titlebar-close');
        closeBtn.append('<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span>');
      },
      overlay: {
        opacity: 0.3,
        background: "#225b7f"
      }
    });
  }
  function myDialog(message, title, buttonok, buttoncancel, response) {
    var _dlg = $('<div>' + message + '</div>');
    var _buttons = {};
    _buttons[buttonok] = function() {
      $(this).dialog('close');
      response(false);
      $(this).dialog('destroy');
    };
    _buttons[buttoncancel] = function() {
      $(this).dialog('close');
      response(true);
      $(this).dialog('destroy');
    };
    _dlg.dialog({
      modal: true,
      draggable: true,
      title: title,
      width: 500,
      buttons: _buttons,
      open: function() {
        var closeBtn = $('.ui-dialog-titlebar-close');
        closeBtn.append('<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span>');
      },
      overlay: {
        opacity: 0.3,
        background: "#225b7f"
      }
    });
  }
  function uuid(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
  }
  function i18nLoad(callback_function) {
    $.i18n.init({
      ns: {
        namespaces: ['ns.special'],
        defaultNs: 'ns.special'
      },
      useLocalStorage: false,
      debug: true
    }, function() {
      callback_function();
    });
  }
  return {
    get trace_func() {
      return trace_func;
    },
    get debug_board() {
      return debug_board;
    },
    get webgl_info() {
      return webgl_info;
    },
    get screenshot() {
      return screenshot;
    },
    get Hoge() {
      return Hoge;
    },
    get confirmDialog() {
      return confirmDialog;
    },
    get myDialog() {
      return myDialog;
    },
    get uuid() {
      return uuid;
    },
    get i18nLoad() {
      return i18nLoad;
    }
  };
});
System.register("objects/ratamahatta", [], function() {
  "use strict";
  var __moduleName = "objects/ratamahatta";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var Ratamahatta = function Ratamahatta(scale, callback_function) {
    PXUtil.trace_func('Ratamahatta::constructor');
    this.cur_animation = null;
    var config = {
      baseUrl: PXConfig._ASSETS_PATH_ + "models/ratamahatta/",
      body: "ratamahatta.js",
      skins: ["ratamahatta.png", "ctf_b.png", "ctf_r.png", "dead.png", "gearwhore.png"],
      weapons: [["weapon.js", "weapon.png"], ["w_bfg.js", "w_bfg.png"], ["w_blaster.js", "w_blaster.png"], ["w_chaingun.js", "w_chaingun.png"], ["w_glauncher.js", "w_glauncher.png"], ["w_hyperblaster.js", "w_hyperblaster.png"], ["w_machinegun.js", "w_machinegun.png"], ["w_railgun.js", "w_railgun.png"], ["w_rlauncher.js", "w_rlauncher.png"], ["w_shotgun.js", "w_shotgun.png"], ["w_sshotgun.js", "w_sshotgun.png"]]
    };
    this.callback_function = callback_function;
    this.character = new THREE.MD2Character();
    this.character.scale = scale;
    var obj = this;
    this.character.onLoadComplete = function() {
      obj.setSkin(0);
      obj.setWeapon(0);
      obj.setAnimation('stand');
      obj.cur_animation = 'stand';
      callback_function(obj.character.root, obj);
    };
    this.character.loadParts(config);
  };
  ($traceurRuntime.createClass)(Ratamahatta, {
    rendering: function(delta) {
      this.character.update(delta);
    },
    getRatamahatta: function() {
      return this.character;
    },
    setAnimation: function(name) {
      this.cur_animation = name;
      this.character.setAnimation(name);
    },
    getAnimation: function() {
      return this.cur_animation;
    },
    setSkin: function(index) {
      this.character.setSkin(index);
    },
    setWeapon: function(index) {
      this.character.setWeapon(index);
    }
  }, {});
  return {get Ratamahatta() {
      return Ratamahatta;
    }};
});
System.register("openingscene", [], function() {
  "use strict";
  var __moduleName = "openingscene";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var PXRatamahatta = System.get("objects/ratamahatta");
  var OpeningScene = function OpeningScene(renderer) {
    PXUtil.trace_func('OpeningScene::constructor');
    this.renderer;
    this.scene;
    this.camera;
    this.keyboard = new THREEx.KeyboardState();
    this.nextScene = "own";
    this.all_items = 1;
    this.loaded_items = 0;
    this.render_target_array = new Array();
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
    this.camera.position.set(-20, 10, 500 / 2);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.light = new THREE.SpotLight(0xffffff);
    this.light.position.set(100, 1000, 0);
    this.light.angle = Math.PI / 4;
    this.scene.add(this.light);
    this.light.castShadow = true;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    this.light.shadowCameraNear = 100;
    this.light.shadowCameraFar = 1100;
    this.light.shadowCameraFov = 30;
    this.light.shadowCameraVisible = false;
    this.renderer.shadowMapEnabled = true;
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
    this.loadObjects();
  };
  ($traceurRuntime.createClass)(OpeningScene, {
    destructor: function() {
      this.scene = null;
      delete this.scene;
    },
    getLoadingStatus: function() {
      if (this.all_items === this.loaded_items || this.loading == false) {
        PXUtil.debug_board('complete');
        return true;
      } else {
        return false;
      }
    },
    loadedIncrements: function() {
      this.loaded_items++;
      if (this.loaded_items === this.all_items) {
        this.loading = false;
        this.clock = new THREE.Clock();
      }
    },
    getNextScene: function() {
      return this.nextScene;
    },
    start: function() {
      $('#openingscene_storybox').remove();
      this.nextScene = "testscene";
    },
    rendering: function() {
      var delta = this.clock.getDelta();
      if (this.keyboard.pressed('enter')) {
        this.start();
      }
      for (var i = 0; i < this.render_target_array.length; i++) {
        this.render_target_array[i].rendering(delta);
      }
      this.renderer.render(this.scene, this.camera);
    },
    loadObjects: function() {
      var $__2 = this;
      this.user_character = new PXRatamahatta.Ratamahatta(1, (function(mesh, obj) {
        mesh.name = "player";
        $__2.scene.add(mesh);
        $__2.loadedIncrements();
      }));
      this.render_target_array.push(this.user_character);
    },
    resize: function() {
      PXUtil.trace_func('OpeningScene::resize');
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    },
    mousedown: function(e) {
      this.start();
    }
  }, {});
  return {get OpeningScene() {
      return OpeningScene;
    }};
});
System.register("startscene", [], function() {
  "use strict";
  var __moduleName = "startscene";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var StartScene = function StartScene(renderer) {
    var $__4 = this;
    PXUtil.trace_func('StartScene::constructor');
    this.renderer;
    this.scene;
    this.camera;
    this.keyboard = new THREEx.KeyboardState();
    this.nextScene = "own";
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
    this.camera.position.set(0, 150, 500);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    $(document.body).append('<div id="startscene_background"></div>');
    $(document.body).append('<div id="startscene_mainbox"></div>');
    $('#startscene_mainbox').append('<h1 id="startscene_title">The Game</h1>');
    $('#startscene_mainbox').append('<p id="startscene_start">start</p>');
    $('#startscene_mainbox').append('<p id="startscene_load">load</p>');
    $('#startscene_mainbox').append('<p id="startscene_config">config</p>');
    $('#startscene_start').on('click', (function() {
      $__4.start();
    }));
    PXUtil.debug_board('complete');
  };
  ($traceurRuntime.createClass)(StartScene, {
    destructor: function() {
      this.scene = null;
      delete this.scene;
    },
    getLoadingStatus: function() {
      return true;
    },
    getNextScene: function() {
      return this.nextScene;
    },
    start: function() {
      $('#startscene_start').off();
      $('#startscene_background').remove();
      $('#startscene_mainbox').remove();
      this.nextScene = "openingscene";
    },
    rendering: function() {
      if (this.keyboard.pressed('up')) {}
      if (this.keyboard.pressed('down')) {}
      if (this.keyboard.pressed('enter')) {
        this.start();
      }
      this.renderer.render(this.scene, this.camera);
    },
    resize: function() {
      PXUtil.trace_func('StartScene::resize');
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    },
    mousedown: function(e) {}
  }, {});
  return {get StartScene() {
      return StartScene;
    }};
});
System.register("objects/debugbox", [], function() {
  "use strict";
  var __moduleName = "objects/debugbox";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var Debugbox = function Debugbox(callback_function) {
    PXUtil.trace_func('Debugbox::constructor');
    this.callback_function = callback_function;
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshPhongMaterial({color: 0x00ff00}));
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.callback_function(this.mesh);
  };
  ($traceurRuntime.createClass)(Debugbox, {rendering: function(delta) {
      this.mesh.rotation.y += delta;
    }}, {});
  return {get Debugbox() {
      return Debugbox;
    }};
});
System.register("objects/shaderbox", [], function() {
  "use strict";
  var __moduleName = "objects/shaderbox";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var Shaderbox = function Shaderbox(myVertexShader1, myFragmentShader1, callback_function) {
    PXUtil.trace_func('Shaderbox::constructor');
    this.callback_function = callback_function;
    var baseTexture = new THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + 'cover.png');
    var sepia = true;
    var sepia_value = false;
    var grayscale_value = false;
    if (sepia === true) {
      sepia_value = true;
    } else {
      grayscale_value = true;
    }
    this.customUniforms = {
      baseTexture: {
        type: "t",
        value: baseTexture
      },
      time: {
        type: "f",
        value: 1.0
      },
      grayscale: {
        type: "i",
        value: grayscale_value
      },
      sepia: {
        type: "i",
        value: sepia_value
      }
    };
    var customMaterial = new THREE.ShaderMaterial({
      uniforms: this.customUniforms,
      vertexShader: myVertexShader1,
      fragmentShader: myFragmentShader1
    });
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), customMaterial);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.callback_function(this.mesh);
  };
  ($traceurRuntime.createClass)(Shaderbox, {rendering: function(delta) {
      this.mesh.rotation.y += delta;
      this.customUniforms.time.value += delta;
    }}, {});
  return {get Shaderbox() {
      return Shaderbox;
    }};
});
System.register("objects/skybox", [], function() {
  "use strict";
  var __moduleName = "objects/skybox";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var Skybox = function Skybox(callback_function) {
    PXUtil.trace_func('Skybox::constructor');
    this.callback_function = callback_function;
    var skyGeometry = new THREE.BoxGeometry(5000 * 3, 5000 * 3, 5000 * 3);
    var materialArray = [];
    materialArray.push(new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + 'skybox/skybox_px.jpg'),
      side: THREE.BackSide
    }));
    materialArray.push(new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + 'skybox/skybox_nx.jpg'),
      side: THREE.BackSide
    }));
    materialArray.push(new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + 'skybox/skybox_py.jpg'),
      side: THREE.BackSide
    }));
    materialArray.push(new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + 'skybox/skybox_ny.jpg'),
      side: THREE.BackSide
    }));
    materialArray.push(new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + 'skybox/skybox_pz.jpg'),
      side: THREE.BackSide
    }));
    materialArray.push(new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + 'skybox/skybox_nz.jpg'),
      side: THREE.BackSide
    }));
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    this.mesh = new THREE.Mesh(skyGeometry, skyMaterial);
    this.callback_function(this.mesh);
  };
  ($traceurRuntime.createClass)(Skybox, {}, {});
  return {get Skybox() {
      return Skybox;
    }};
});
System.register("objects/terrain", [], function() {
  "use strict";
  var __moduleName = "objects/terrain";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var Terrain = function Terrain(callback_function) {
    PXUtil.trace_func('Terrain::constructor');
    this.mesh;
    this.callback_function = callback_function;
    var FLOOR = -1000;
    var img = new Image();
    var obj = this;
    img.onload = function() {
      var data = obj.getHeightData(img);
      var plane = new THREE.PlaneGeometry(100, 100, 127, 127);
      for (var i = 0,
          l = plane.vertices.length; i < l; i++) {
        plane.vertices[i].z = data[i];
      }
      obj.mesh = obj.addMesh(plane, 100, 0, FLOOR, 0, -1.57, 0, 0, obj.getTerrainMaterial());
      obj.mesh.receiveShadow = true;
      obj.callback_function(obj.mesh);
    };
    img.src = PXConfig._ASSETS_PATH_ + 'heightmap/heightmap_128.jpg';
    var water = new THREE.PlaneGeometry(100, 100, 1, 1);
    for (var i = 0; i < water.faces.length; i++) {
      var uvs = water.faces[1];
      for (var j = 0,
          jl = uvs.length; j < jl; j++) {
        uvs[j].u *= 10;
        uvs[j].v *= 10;
      }
    }
    var waterMesh = this.addMesh(water, 63, -1000, FLOOR + 620, 1000, -1.57, 0, 0, this.getWaterMaterial());
  };
  ($traceurRuntime.createClass)(Terrain, {
    getMesh: function() {
      return this.mesh;
    },
    getHeightData: function(img) {
      var canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      var context = canvas.getContext('2d');
      var size = 128 * 128;
      var data = new Float32Array(size);
      context.drawImage(img, 0, 0);
      for (var i = 0; i < size; i++) {
        data[i] = 0;
      }
      var imgd = context.getImageData(0, 0, 128, 128);
      var pix = imgd.data;
      var j = 0;
      for (var i = 0,
          n = pix.length; i < n; i += (4)) {
        var all = pix[i] + pix[i + 1] + pix[i + 2];
        data[j++] = all / 30;
      }
      return data;
    },
    addMesh: function(geometry, scale, x, y, z, rx, ry, rz, material) {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
      mesh.position.x = x;
      mesh.position.y = y;
      mesh.position.z = z;
      mesh.rotation.x = rx;
      mesh.rotation.y = ry;
      mesh.rotation.z = rz;
      mesh.overdraw = true;
      mesh.doubleSided = false;
      mesh.updateMatrix();
      return mesh;
    },
    getTerrainMaterial: function() {
      var terrainMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(null, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping),
        ambient: 0xaaaaaa,
        specular: 0xffffff,
        shininess: 0,
        shading: THREE.SmoothShading
      });
      terrainMaterial.map = THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + "heightmap/terrain.jpg");
      return terrainMaterial;
    },
    getWaterMaterial: function() {
      var waterMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(null, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping),
        ambient: 0x666666,
        specular: 0xffffff,
        reflectivity: 0.15,
        shininess: 10,
        shading: THREE.SmoothShading
      });
      waterMaterial.map = THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + "heightmap/water.jpg");
      return waterMaterial;
    },
    rendering: function(delta) {}
  }, {});
  return {get Terrain() {
      return Terrain;
    }};
});
System.register("testscene", [], function() {
  "use strict";
  var __moduleName = "testscene";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var PXDebugbox = System.get("objects/debugbox");
  var PXShaderbox = System.get("objects/shaderbox");
  var PXTerrain = System.get("objects/terrain");
  var PXSkybox = System.get("objects/skybox");
  var PXRatamahatta = System.get("objects/ratamahatta");
  var _TEST_CONTROLLER_ = true;
  var _CAN_JUMP_ = false;
  var TestScene = function TestScene(renderer) {
    PXUtil.trace_func('TestScene::constructor');
    this.renderer;
    this.scene;
    this.camera;
    this.light;
    this.ambient;
    this.all_items = 6;
    this.loaded_items = 0;
    this.nextScene = "own";
    this.render_target_array = new Array();
    this.clock;
    this.water = null;
    this.keyboard = new THREEx.KeyboardState();
    this.user_character = null;
    this.grounds_collision_array = new Array();
    this.walls_collision_array = new Array();
    this.mouseLook = {
      x: 0,
      y: 0
    };
    this.gravity = new THREE.Vector3(0, -10, 0);
    this.cur_anim_name = 'stand';
    this.attack_delta = 0;
    this.monsters_array = new Array();
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.light = new THREE.SpotLight(0xffffff);
    this.light.position.set(100, 1000, 0);
    this.light.angle = Math.PI / 4;
    this.scene.add(this.light);
    this.light.castShadow = true;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    this.light.shadowCameraNear = 100;
    this.light.shadowCameraFar = 1100;
    this.light.shadowCameraFov = 30;
    this.light.shadowCameraVisible = true;
    this.renderer.shadowMapEnabled = true;
    this.loadObjects();
    if (_TEST_CONTROLLER_) {
      this.trackball = new THREE.TrackballControls(this.camera);
    }
  };
  ($traceurRuntime.createClass)(TestScene, {
    destructor: function() {
      this.scene = null;
      delete this.scene;
    },
    getLoadingStatus: function() {
      if (this.all_items === this.loaded_items || this.loading == false) {
        return true;
      } else {
        return false;
      }
    },
    loadedIncrements: function() {
      this.loaded_items++;
      if (this.loaded_items === this.all_items) {
        this.loading = false;
        this.clock = new THREE.Clock();
      }
    },
    getNextScene: function() {
      return this.nextScene;
    },
    rendering: function() {
      if (_TEST_CONTROLLER_) {
        this.trackball.update();
      }
      var delta = this.clock.getDelta();
      if (delta > 1.0)
        return;
      {
        if (this.attack_delta >= 0)
          this.attack_delta--;
        if (this.attack_delta < 0) {
          if (this.cur_anim_name == 'attack') {
            this.cur_anim_name = 'stand';
            this.user_character.setAnimation('stand');
          }
        }
        var move = {
          xDist: 0,
          yAngle: 0,
          zDist: 0
        };
        var moveDistance = 200 * delta;
        var rotateAngle = Math.PI / 4 * delta;
        var moving = false;
        if (this.keyboard.pressed('W')) {
          if (this.cur_anim_name != 'attack') {
            PXUtil.trace_func('UP');
            if (this.cur_anim_name != 'run') {
              if (this.cur_anim_name != 'jump') {
                this.cur_anim_name = 'run';
                this.user_character.setAnimation('run');
              }
            }
            move.zDist += moveDistance;
            moving = true;
          }
        }
        if (this.keyboard.pressed('A')) {
          if (this.cur_anim_name != 'attack') {
            PXUtil.trace_func('LEFT');
            if (this.cur_anim_name != 'run') {
              if (this.cur_anim_name != 'jump') {
                this.cur_anim_name = 'run';
                this.user_character.setAnimation('run');
              }
            }
            move.xDist += moveDistance;
            moving = true;
          }
        }
        if (this.keyboard.pressed('S')) {
          if (this.cur_anim_name != 'attack') {
            PXUtil.trace_func('DOWN');
            if (this.cur_anim_name != 'run') {
              if (this.cur_anim_name != 'jump') {
                this.cur_anim_name = 'run';
                this.user_character.setAnimation('run');
              }
            }
            move.zDist -= moveDistance;
            moving = true;
          }
        }
        if (this.keyboard.pressed('D')) {
          if (this.cur_anim_name != 'attack') {
            PXUtil.trace_func('RIGHT');
            if (this.cur_anim_name != 'run') {
              if (this.cur_anim_name != 'jump') {
                this.cur_anim_name = 'run';
                this.user_character.setAnimation('run');
              }
            }
            move.xDist -= moveDistance;
            moving = true;
          }
        }
        if (this.keyboard.pressed('Q')) {
          if (this.cur_anim_name != 'attack') {
            PXUtil.trace_func('TURN LEFT');
            if (this.cur_anim_name != 'run') {
              if (this.cur_anim_name != 'jump') {
                this.cur_anim_name = 'run';
                this.user_character.setAnimation('run');
              }
            }
            move.yAngle += rotateAngle;
            moving = true;
          }
        }
        if (this.keyboard.pressed('E')) {
          if (this.cur_anim_name != 'attack') {
            PXUtil.trace_func('TURN RIGHT');
            if (this.cur_anim_name != 'run') {
              if (this.cur_anim_name != 'jump') {
                this.cur_anim_name = 'run';
                this.user_character.setAnimation('run');
              }
            }
            move.yAngle -= rotateAngle;
            moving = true;
          }
        }
        if (!moving && this.cur_anim_name != 'attack' && this.cur_anim_name != 'jump') {
          if (this.cur_anim_name != 'stand') {
            this.cur_anim_name = 'stand';
            this.user_character.setAnimation('stand');
          }
        }
        move.yAngle -= rotateAngle * this.mouseLook.x * 0.1;
        this.mouseLook.x = 0;
        var person = this.user_character.getRatamahatta();
        person.root.translateZ(move.zDist);
        person.root.rotateY(move.yAngle);
        person.root.translateX(move.xDist);
        person.root.updateMatrix();
        var person_point_xz = new THREE.Vector3(person.root.position.x, person.root.position.y, person.root.position.z);
        var col = this.collision(person_point_xz, this.walls_collision_array);
        if (col) {
          person.root.translateX(-move.xDist);
          person.root.rotateY(-move.yAngle);
          person.root.translateZ(-move.zDist);
          person.root.updateMatrix();
        }
        if (_CAN_JUMP_) {
          if (this.keyboard.pressed('space') && person.root.velocity.y == 0) {
            PXUtil.trace_func('JUMP');
            if (this.cur_anim_name != 'jump') {
              this.cur_anim_name = 'jump';
              this.user_character.setAnimation('jump');
            }
            person.root.velocity = new THREE.Vector3(0, 3, 0);
          }
          person.root.velocity.add(this.gravity.clone().multiplyScalar(delta));
          person.root.translateY(person.root.velocity.y);
          person.root.updateMatrix();
          var ray = new THREE.Raycaster();
          ray.ray.direction.set(0, -1, 0);
          var person_step_area = new THREE.Vector3(person.root.position.x, person.root.position.y - 20.0, person.root.position.z);
          ray.ray.origin.copy(person_step_area);
          var intersects = ray.intersectObjects(this.grounds_collision_array);
          if (intersects.length > 0) {
            var distance = intersects[0].distance;
            console.log(distance);
            PXUtil.debug_board('delta: ' + delta + ' distance:' + distance + " point.y:" + intersects[0].point.y + '<br>person x:' + person.root.position.x + " y:" + person.root.position.y + " z:" + person.root.position.z);
            if (distance > 0 && distance < 10) {
              if (this.cur_anim_name == 'jump') {
                this.cur_anim_name = 'stand';
                this.user_character.setAnimation('stand');
              }
              person.root.translateY(-person.root.velocity.y);
              person.root.updateMatrix();
              person.root.velocity = new THREE.Vector3(0, 0, 0);
            } else {}
          } else {
            PXUtil.debug_board('落下!');
          }
        }
        if (!_CAN_JUMP_) {
          var ray = new THREE.Raycaster();
          ray.ray.direction.set(0, -1, 0);
          var person_point = new THREE.Vector3(person.root.position.x, person.root.position.y + 50, person.root.position.z);
          ray.ray.origin.copy(person_point);
          var intersects = ray.intersectObjects(this.grounds_collision_array);
          if (intersects.length > 0) {
            person.root.position.y = intersects[0].point.y + 25;
          }
        }
        PXUtil.debug_board('delta: ' + delta + '<br>person x:' + person.root.position.x + " y:" + person.root.position.y + " z:" + person.root.position.z + '<br>' + 'info.memory.programs:' + this.renderer.info.memory.programs + '<br>' + 'info.memory.geometries:' + this.renderer.info.memory.geometries + '<br>' + 'info.memory.textures:' + this.renderer.info.memory.textures + '<br>' + 'info.render.calls:' + this.renderer.info.render.calls + '<br>' + 'info.render.vertices:' + this.renderer.info.render.vertices + '<br>' + 'info.render.faces:' + this.renderer.info.render.faces + '<br>' + 'info.render.points:' + this.renderer.info.render.points);
        this.light.position.set(person.root.position.x, person.root.position.y + 1000, person.root.position.z);
        this.light.target.position.set(person.root.position.x, person.root.position.y - 25, person.root.position.z);
        {
          if (person.root.position.x >= 50 && person.root.position.x <= 100 && person.root.position.z >= 500 && person.root.position.z <= 800) {
            this.nextScene = "threefieldscene";
          }
        }
      }
      for (var i = 0; i < this.render_target_array.length; i++) {
        this.render_target_array[i].rendering(delta);
      }
      this.water.material.uniforms.time.value += 1.0 / 60.0;
      this.renderer.render(this.scene, this.camera);
    },
    collision: function(person_point, collision_array) {
      var ray = new THREE.Raycaster();
      ray.ray.direction.set(0, 0, -1);
      ray.ray.origin.copy(person_point);
      var intersects = ray.intersectObjects(collision_array);
      if (intersects.length > 0) {
        var distance = intersects[0].distance;
        if (distance > 0 && distance < 10) {
          return true;
        }
      }
      ray.ray.direction.set(0, 0, 1);
      ray.ray.origin.copy(person_point);
      var intersects = ray.intersectObjects(collision_array);
      if (intersects.length > 0) {
        var distance = intersects[0].distance;
        if (distance > 0 && distance < 10) {
          return true;
        }
      }
      ray.ray.direction.set(-1, 0, 0);
      ray.ray.origin.copy(person_point);
      var intersects = ray.intersectObjects(collision_array);
      if (intersects.length > 0) {
        var distance = intersects[0].distance;
        if (distance > 0 && distance < 10) {
          return true;
        }
      }
      ray.ray.direction.set(1, 0, 0);
      ray.ray.origin.copy(person_point);
      var intersects = ray.intersectObjects(collision_array);
      if (intersects.length > 0) {
        var distance = intersects[0].distance;
        if (distance > 0 && distance < 10) {
          return true;
        }
      }
      return false;
    },
    loadObjects: function() {
      var $__10 = this;
      var debugbox = new PXDebugbox.Debugbox((function(mesh) {
        mesh.position.y += 70;
        $__10.scene.add(mesh);
        $__10.loadedIncrements();
        $__10.grounds_collision_array.push(mesh);
      }));
      this.render_target_array.push(debugbox);
      var debugbox2 = new PXDebugbox.Debugbox((function(mesh) {
        mesh.position.x = 83;
        mesh.position.y = 190;
        mesh.position.z = 716;
        $__10.scene.add(mesh);
        $__10.loadedIncrements();
        $__10.walls_collision_array.push(mesh);
      }));
      SHADER_LOADER.load((function(data) {
        var myVertexShader1 = data.vertexShader.vertex;
        var myFragmentShader1 = data.fragmentShader.fragment;
        var shaderbox = new PXShaderbox.Shaderbox(myVertexShader1, myFragmentShader1, (function(mesh) {
          mesh.position.y += 70;
          mesh.position.x += 120;
          $__10.scene.add(mesh);
          $__10.loadedIncrements();
          $__10.grounds_collision_array.push(mesh);
        }));
        $__10.render_target_array.push(shaderbox);
      }));
      var waterNormals = new THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + 'water/waternormals.jpg');
      waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
      var directionalLight = new THREE.DirectionalLight(0xffff55, 1);
      directionalLight.position.set(-600, 300, 600);
      this.scene.add(directionalLight);
      this.water = new THREE.Water(this.renderer, this.camera, this.scene, {
        textureWidth: 256,
        textureHeight: 256,
        waterNormals: waterNormals,
        alpha: 1.0,
        sunDirection: directionalLight.position.normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        betaVersion: 0,
        side: THREE.DoubleSide,
        distortionScale: 50.0
      });
      var waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(2000 * 10, 2000 * 10, 100, 100), this.water.material);
      waterMesh.position.y = -600;
      waterMesh.add(this.water);
      waterMesh.rotation.x = -Math.PI * 0.5;
      this.scene.add(waterMesh);
      var terrain = new PXTerrain.Terrain((function(mesh) {
        $__10.scene.add(mesh);
        $__10.loadedIncrements();
        $__10.grounds_collision_array.push(mesh);
      }));
      var skybox = new PXSkybox.Skybox((function(mesh) {
        $__10.scene.add(mesh);
        $__10.loadedIncrements();
      }));
      this.user_character = new PXRatamahatta.Ratamahatta(1, (function(mesh, obj) {
        mesh.position.y += 1000;
        mesh.name = "player";
        $__10.scene.add(mesh);
        $__10.camera.position.z = -50;
        $__10.camera.position.y = 30;
        $__10.camera.lookAt(new THREE.Vector3(0, 20, 0));
        mesh.add($__10.camera);
        mesh.velocity = new THREE.Vector3(0, 0, 0);
        $__10.loadedIncrements();
      }));
      this.render_target_array.push(this.user_character);
    },
    resize: function() {
      PXUtil.trace_func('TestScene::resize');
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    },
    mousedown: function(e) {
      if (this.cur_anim_name != 'attack') {
        this.cur_anim_name = 'attack';
        this.user_character.setAnimation('attack');
        this.attack_delta = 20;
        {
          var projector = new THREE.Projector();
          var rect = e.target.getBoundingClientRect();
          var mouseX = e.clientX - rect.left;
          var mouseY = e.clientY - rect.top;
          mouseX = (mouseX / window.innerWidth) * 2 - 1;
          mouseY = -(mouseY / window.innerHeight) * 2 + 1;
          this.scene.updateMatrixWorld(true);
          var cam_position = new THREE.Vector3();
          cam_position.setFromMatrixPosition(this.camera.matrixWorld);
          console.log(mouseX + "," + mouseY + "/" + this.camera.position.x + "," + this.camera.position.y + "," + this.camera.position.z);
          var pos = new THREE.Vector3(mouseX, mouseY, 1);
          projector.unprojectVector(pos, this.camera);
          var ray = new THREE.Raycaster(cam_position, pos.sub(cam_position).normalize());
          for (var i = 0; i < this.monsters_array.length; i++) {
            var monster_character = this.monsters_array[i].getRatamahatta();
            var intersects = ray.intersectObjects(monster_character.root.children);
            if (intersects.length > 0) {
              console.log('何かにあたった' + monster_character.root.name);
            }
          }
        }
      }
    }
  }, {});
  return {get TestScene() {
      return TestScene;
    }};
});
System.register("objects/debugfloor", [], function() {
  "use strict";
  var __moduleName = "objects/debugfloor";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var Debugfloor = function Debugfloor(callback_function) {
    PXUtil.trace_func('Debugbox::constructor');
    this.callback_function = callback_function;
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshPhongMaterial({color: 0xe0e0e0}));
    this.mesh.rotation.x = Math.PI + Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.callback_function(this.mesh);
  };
  ($traceurRuntime.createClass)(Debugfloor, {rendering: function(delta) {}}, {});
  return {get Debugfloor() {
      return Debugfloor;
    }};
});
System.register("objects/enemies", [], function() {
  "use strict";
  var __moduleName = "objects/enemies";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var Sprite = function Sprite(message, callback_function) {
    PXUtil.trace_func('Sprite::constructor');
    this.callback_function = callback_function;
    this.sprite = this.makeTextSprite(message, {
      fontsize: 24,
      borderColor: {
        r: 255,
        g: 0,
        b: 0,
        a: 1.0
      },
      backgroundColor: {
        r: 255,
        g: 100,
        b: 100,
        a: 0.8
      }
    });
    this.callback_function(this.sprite);
  };
  ($traceurRuntime.createClass)(Sprite, {
    getSprite: function() {
      return this.sprite;
    },
    setPositionVector3: function(v) {
      this.sprite.position.set(v.x, v.y, v.z);
    },
    setPosition: function(x, y, z) {
      this.sprite.position.set(x, y, z);
    },
    rendering: function(delta) {},
    updateSprite: function(message, parameters) {
      if (parameters === undefined)
        parameters = {};
      var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
      var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
      var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
      var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : {
        r: 0,
        g: 0,
        b: 0,
        a: 1.0
      };
      var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : {
        r: 255,
        g: 255,
        b: 255,
        a: 1.0
      };
      var metrics = this.context.measureText(message);
      var textWidth = metrics.width;
      this.context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
      this.context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
      this.context.lineWidth = borderThickness;
      this.roundRect(this.context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
      this.context.fillStyle = "rgba(0, 0, 0, 1.0)";
      this.context.fillText(message, borderThickness, fontsize + borderThickness);
      this.texture.needsUpdate = true;
    },
    makeTextSprite: function(message, parameters) {
      if (parameters === undefined)
        parameters = {};
      var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
      var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
      var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
      var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : {
        r: 0,
        g: 0,
        b: 0,
        a: 1.0
      };
      var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : {
        r: 255,
        g: 255,
        b: 255,
        a: 1.0
      };
      var canvas = document.createElement('canvas');
      this.context = canvas.getContext('2d');
      this.context.font = "Bold " + fontsize + "px " + fontface;
      var metrics = this.context.measureText(message);
      var textWidth = metrics.width;
      this.context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
      this.context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
      this.context.lineWidth = borderThickness;
      this.roundRect(this.context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
      this.context.fillStyle = "rgba(0, 0, 0, 1.0)";
      this.context.fillText(message, borderThickness, fontsize + borderThickness);
      this.texture = new THREE.Texture(canvas);
      this.texture.needsUpdate = true;
      var spriteMaterial = new THREE.SpriteMaterial({
        map: this.texture,
        useScreenCoordinates: false
      });
      var sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(100, 50, 1.0);
      return sprite;
    },
    roundRect: function(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }, {});
  var Enemy = function Enemy() {
    this.name = "";
    this.maxhp = 100;
    this.hp = 100;
    this.maxmp = 0;
    this.mp = 0;
    this.maxammo = 10;
    this.ammo = 10;
    this.status = null;
    this.character = null;
    this.target_positions_array = null;
    this.target_position_index = 0;
    this.current_animation = "idol";
    this.sprite = null;
    this.y_timing = Math.floor(Math.random()) * 10;
    this.timing = 0;
  };
  ($traceurRuntime.createClass)(Enemy, {
    calcDistance: function(x1, y1, x2, y2) {
      var a,
          b,
          d;
      a = x1 - x2;
      b = y1 - y2;
      d = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
      return d;
    },
    rendering: function(delta, ground_collision_array) {
      var target_position = new THREE.Vector3(this.target_positions_array[this.target_position_index].x, this.character.root.position.y, this.target_positions_array[this.target_position_index].z);
      this.character.root.lookAt(target_position);
      var distance = this.calcDistance(this.character.root.position.x, this.character.root.position.z, target_position.x, target_position.z);
      var moveDistance = 200 * delta / 10;
      this.character.root.translateZ(moveDistance);
      if (distance < 10.0) {
        if (this.target_position_index + 1 >= this.target_positions_array.length) {
          this.target_position_index = 0;
        } else {
          this.target_position_index++;
        }
      }
      if (this.timing == this.y_timing) {
        var ray = new THREE.Raycaster();
        ray.ray.direction.set(0, -1, 0);
        var person_point = new THREE.Vector3(this.character.root.position.x, this.character.root.position.y + 200, this.character.root.position.z);
        ray.ray.origin.copy(person_point);
        var intersects = ray.intersectObjects(ground_collision_array);
        if (intersects.length > 0) {
          this.character.root.position.y = intersects[0].point.y + 8;
        }
      }
      this.sprite.updateSprite(" " + this.name + " HP:" + this.hp-- + "/" + this.maxhp + " ", {
        fontsize: 24,
        borderColor: {
          r: 255,
          g: 0,
          b: 0,
          a: 1.0
        },
        backgroundColor: {
          r: 255,
          g: 100,
          b: 100,
          a: 0.8
        }
      });
      this.sprite.setPosition(this.character.root.position.x, this.character.root.position.y + 30, this.character.root.position.z);
      this.character.update(delta);
      this.timing++;
      if (this.timing > 10) {
        this.timing = 0;
      }
    }
  }, {});
  var Enemies = function Enemies(nCharacters, callback_function) {
    PXUtil.trace_func('Enemies::constructor');
    var config = {
      baseUrl: PXConfig._ASSETS_PATH_ + "models/ogro/",
      body: "ogro-light.js",
      skins: ["grok.jpg", "ogrobase.png", "arboshak.png", "ctf_r.png", "ctf_b.png", "darkam.png", "freedom.png", "gib.png", "gordogh.png", "igdosh.png", "khorne.png", "nabogro.png"],
      weapons: [["weapon-light.js", "weapon.jpg"]],
      animations: {
        move: "run",
        idle: "stand",
        jump: "jump",
        attack: "attack",
        crouchMove: "cwalk",
        crouchIdle: "cstand",
        crouchAttach: "crattack"
      },
      walkSpeed: 350,
      crouchSpeed: 175
    };
    var controls = {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false
    };
    this.callback_function = callback_function;
    this.characters = new Array();
    this.cloneCharacterRoots = new Array();
    this.sprites = new Array();
    for (var i = 0; i < nCharacters; i++) {
      var character = new THREE.MD2CharacterComplex();
      character.scale = 1 / 3;
      character.controls = controls;
      var enemy = new Enemy();
      enemy.character = character;
      enemy.target_positions_array = new Array();
      for (var j = 0; j < 3; j++) {
        var x = Math.floor(Math.random() * 300) + 200;
        var z = Math.floor(Math.random() * 300) + 600;
        enemy.target_positions_array.push({
          x: x,
          z: z
        });
      }
      enemy.name = "モンスター" + i;
      var sprite = new Sprite(" " + enemy.name + " HP:" + enemy.hp + "/" + enemy.maxhp + " ", (function() {}));
      enemy.sprite = sprite;
      this.characters.push(enemy);
    }
    var baseCharacter = new THREE.MD2CharacterComplex();
    baseCharacter.scale = 1 / 2;
    var obj = this;
    baseCharacter.onLoadComplete = function() {
      for (var i = 0; i < nCharacters; i++) {
        var cloneCharacter = obj.characters[i].character;
        cloneCharacter.shareParts(baseCharacter);
        cloneCharacter.enableShadows(true);
        cloneCharacter.setWeapon(0);
        cloneCharacter.setSkin(i);
        cloneCharacter.frontAcceleration = 0;
        cloneCharacter.controls.moveForward = true;
        cloneCharacter.root.position.x = Math.floor(Math.random() * 300) + 200;
        cloneCharacter.root.position.y = 300;
        cloneCharacter.root.position.z = Math.floor(Math.random() * 300) + 600;
        obj.cloneCharacterRoots.push(cloneCharacter.root);
        obj.sprites.push(obj.characters[i].sprite.getSprite());
      }
      obj.callback_function(obj.cloneCharacterRoots, obj.sprites);
    };
    baseCharacter.loadParts(config);
  };
  ($traceurRuntime.createClass)(Enemies, {rendering: function(delta, ground_collision_array) {
      for (var i = 0; i < this.characters.length; i++) {
        this.characters[i].rendering(delta, ground_collision_array);
      }
    }}, {});
  return {get Enemies() {
      return Enemies;
    }};
});
System.register("threefieldscene", [], function() {
  "use strict";
  var __moduleName = "threefieldscene";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var PXDebugbox = System.get("objects/debugbox");
  var PXShaderbox = System.get("objects/shaderbox");
  var PXTerrain = System.get("objects/terrain");
  var PXSkybox = System.get("objects/skybox");
  var PXRatamahatta = System.get("objects/ratamahatta");
  var PXDebugfloor = System.get("objects/debugfloor");
  var PXEnemies = System.get("objects/enemies");
  var ThreefieldScene = function ThreefieldScene(renderer) {
    var $__14 = this;
    PXUtil.trace_func('ThreefieldScene::constructor');
    this.renderer;
    this.scene;
    this.camera;
    this.light;
    this.ambient;
    this.all_items = 6;
    this.loaded_items = 0;
    this.nextScene = "own";
    this.render_target_array = new Array();
    this.clock;
    this.attack_delta = 0;
    this.grounds_collision_array = new Array();
    this.player_status = {
      maxhp: 100,
      hp: 100,
      maxmp: 100,
      mp: 100,
      maxammo: 100,
      ammo: 100,
      status: ''
    };
    this.player_mesh;
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20000);
    this.camera.position.set(0, 150, 500);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.light = new THREE.SpotLight(0xffffff);
    this.light.position.set(100, 1000 / 2, 0);
    this.light.angle = Math.PI / 4;
    this.scene.add(this.light);
    this.ambient = new THREE.AmbientLight(0x333333);
    this.scene.add(this.ambient);
    this.light.castShadow = true;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    this.light.shadowCameraNear = 10;
    this.light.shadowCameraFar = 400;
    this.light.shadowCameraFov = 30;
    this.light.shadowCameraVisible = true;
    this.renderer.shadowMapEnabled = true;
    this.world = new THREEFIELD.World();
    this.playerObjectHolder = new THREE.Object3D();
    this.playerObjectHolder.position.set(0, 100, 0);
    this.scene.add(this.playerObjectHolder);
    var playerRadius = 1;
    this.playerController = new THREEFIELD.CharacterController(this.playerObjectHolder, playerRadius, this.world);
    this.playerController.movementSpeed = 30;
    this.keyInputControl = new THREEFIELD.KeyInputControl();
    this.keyInputControl.addEventListener('movekeyhold', (function() {
      $__14.playerController.isWalking = true;
    }));
    this.keyInputControl.addEventListener('movekeyrelease', (function() {
      $__14.playerController.isWalking = false;
    }));
    this.keyInputControl.addEventListener('jumpkeypress', (function() {
      $__14.playerController.jump();
    }));
    this.playerController.addEventListener('startIdling', (function() {
      $__14.user_character.setAnimation('stand');
    }));
    this.playerController.addEventListener('startWalking', (function() {
      $__14.user_character.setAnimation('run');
    }));
    this.playerController.addEventListener('startJumping', (function() {
      $__14.user_character.setAnimation('jump');
    }));
    this.gyroscopeCameraControl = new THREEFIELD.GyroscopeCameraControl(this.camera, this.playerObjectHolder, {
      el: this.renderer.domElement,
      offset: new THREE.Vector3(0, 12, 0),
      radius: 60,
      minRadius: 20,
      maxRadius: 100
    });
    this.loadObjects();
    $(document.body).append('<div id="hud"></div>');
    $('#hud').append('<div id="hud0"></div>');
    $('#hud0').append('<span id="health">HP:' + this.player_status.hp + '/' + this.player_status.maxhp + '</span>');
    $('#hud0').append('<span id="magicpoint">MP:' + this.player_status.mp + '/' + this.player_status.maxmp + '</span>');
    $('#hud').append('<div id="hud1"></div>');
    $('#hud1').append('<span id="ammo">AMMO:' + this.player_status.ammo + '/' + this.player_status.maxammo + '</span>');
    $('#hud1').append('<span id="status">status:' + this.player_status.status + '</span>');
    $('#hud').append('<div id="hud2"></div>');
    $('#hud2').append('<span id="character_debug">debug:n/a</span>');
  };
  ($traceurRuntime.createClass)(ThreefieldScene, {
    destructor: function() {
      $('#hud').remove();
      this.scene = null;
      delete this.scene;
    },
    getLoadingStatus: function() {
      if (this.all_items === this.loaded_items || this.loading == false) {
        return true;
      } else {
        return false;
      }
    },
    loadedIncrements: function() {
      this.loaded_items++;
      if (this.loaded_items === this.all_items) {
        this.loading = false;
        this.clock = new THREE.Clock();
      }
    },
    getNextScene: function() {
      return this.nextScene;
    },
    rendering: function() {
      var delta = this.clock.getDelta();
      var cameraFrontAngle = this.gyroscopeCameraControl.getFrontAngle();
      var characterFrontAngle = this.keyInputControl.getFrontAngle();
      this.playerController.frontAngle = (360 - cameraFrontAngle) + characterFrontAngle % 360;
      this.player_mesh.rotation.y = THREE.Math.degToRad((360 - cameraFrontAngle) + characterFrontAngle % 360) + Math.PI;
      this.gyroscopeCameraControl.update();
      this.world.step(delta);
      this.light.position.set(this.playerController.object.position.x, this.playerController.object.position.y + 300, this.playerController.object.position.z);
      this.light.target.position.set(this.playerController.object.position.x, this.playerController.object.position.y - 100, this.playerController.object.position.z);
      if (this.attack_delta >= 0)
        this.attack_delta--;
      if (this.attack_delta < 0) {
        if (this.user_character.getAnimation() == 'attack') {
          if (this.playerController.isWalking) {
            this.user_character.setAnimation('run');
          } else {
            this.user_character.setAnimation('stand');
          }
        }
      }
      for (var i = 0; i < this.render_target_array.length; i++) {
        this.render_target_array[i].rendering(delta, this.grounds_collision_array);
      }
      this.updateHUD();
      PXUtil.debug_board('delta: ' + delta + '<br>person x:' + this.playerController.object.position.x + " y:" + this.playerController.object.position.y + " z:" + this.playerController.object.position.z + '<br>' + 'info.memory.programs:' + this.renderer.info.memory.programs + '<br>' + 'info.memory.geometries:' + this.renderer.info.memory.geometries + '<br>' + 'info.memory.textures:' + this.renderer.info.memory.textures + '<br>' + 'info.render.calls:' + this.renderer.info.render.calls + '<br>' + 'info.render.vertices:' + this.renderer.info.render.vertices + '<br>' + 'info.render.faces:' + this.renderer.info.render.faces + '<br>' + 'info.render.points:' + this.renderer.info.render.points);
      this.renderer.render(this.scene, this.camera);
    },
    loadObjects: function() {
      var $__14 = this;
      var debugbox = new PXDebugbox.Debugbox((function(mesh) {
        $__14.scene.add(mesh);
        var groundBody = new THREEFIELD.Collider(mesh);
        $__14.world.add(groundBody);
        $__14.loadedIncrements();
      }));
      SHADER_LOADER.load((function(data) {
        var myVertexShader1 = data.vertexShader.vertex;
        var myFragmentShader1 = data.fragmentShader.fragment;
        var shaderbox = new PXShaderbox.Shaderbox(myVertexShader1, myFragmentShader1, (function(mesh) {
          mesh.position.y += 70;
          mesh.position.x += 120;
          $__14.scene.add(mesh);
          $__14.loadedIncrements();
        }));
        $__14.render_target_array.push(shaderbox);
      }));
      this.terrain = new PXTerrain.Terrain((function(mesh) {
        $__14.scene.add(mesh);
        $__14.loadedIncrements();
        var groundBody = new THREEFIELD.Collider(mesh);
        $__14.world.add(groundBody);
        $__14.grounds_collision_array.push(mesh);
      }));
      var skybox = new PXSkybox.Skybox((function(mesh) {
        $__14.scene.add(mesh);
        $__14.loadedIncrements();
      }));
      this.user_character = new PXRatamahatta.Ratamahatta(1 / 2, (function(mesh, obj) {
        mesh.position.y -= 1;
        mesh.name = "player";
        $__14.scene.add(mesh);
        $__14.playerObjectHolder.add(mesh);
        $__14.player_mesh = mesh;
        $__14.playerController.object.position.x = 83;
        $__14.playerController.object.position.y = 200;
        $__14.playerController.object.position.z = 716;
        $__14.loadedIncrements();
      }));
      this.render_target_array.push(this.user_character);
      var enemies = new PXEnemies.Enemies(10, (function(meshes, sprites) {
        for (var i = 0; i < meshes.length; i++) {
          $__14.scene.add(meshes[i]);
        }
        for (var i = 0; i < sprites.length; i++) {
          $__14.scene.add(sprites[i]);
        }
        $__14.loadedIncrements();
      }));
      this.render_target_array.push(enemies);
    },
    resize: function() {
      PXUtil.trace_func('TestScene::resize');
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    },
    mousedown: function(e) {
      if (this.user_character.getAnimation() != 'attack') {
        this.user_character.setAnimation('attack');
        this.attack_delta = 20;
      }
    },
    updateHUD: function() {
      $('#health').html('HP:' + this.player_status.hp + '/' + this.player_status.maxhp);
      $('#magicpoint').html('MP:' + this.player_status.mp + '/' + this.player_status.maxmp);
      $('#ammo').html('AMMO:' + this.player_status.ammo + '/' + this.player_status.maxammo);
      $('#status').html('status:' + this.player_status.status);
      $('#character_debug').html('debug:n/a');
    }
  }, {});
  return {get ThreefieldScene() {
      return ThreefieldScene;
    }};
});
System.register("app", [], function() {
  "use strict";
  var __moduleName = "app";
  var PXUtil = System.get("util");
  var PXConfig = System.get("config");
  var PXStartScene = System.get("startscene");
  var PXOpeningScene = System.get("openingscene");
  var PXTestScene = System.get("testscene");
  var PXThreefieldScene = System.get("threefieldscene");
  var Application = function Application() {
    PXUtil.trace_func('App::constructor');
    this.renderer;
    this.stats;
    this.currentSceneObject;
    this.renderer = Detector.webgl ? new THREE.WebGLRenderer({antialias: true}) : new THREE.CanvasRenderer();
    if (Detector.webgl) {
      PXUtil.webgl_info(this.renderer);
    } else {}
    var width = window.innerWidth;
    var height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x00000, 1);
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.stats.domElement.style.zIndex = 100;
    document.body.appendChild(this.stats.domElement);
    if (PXConfig._DEBUG_MODE_) {
      $(document.body).append('<div id="debug_board" width="200" height="200">test<br>test2<br>test3<br></div>');
    }
    PXUtil.debug_board('Now Loading...');
    this.currentSceneObject = new PXStartScene.StartScene(this.renderer);
    this.resize();
    this.mouseevent();
  };
  ($traceurRuntime.createClass)(Application, {
    run: function() {
      PXUtil.trace_func('App::run');
      this.update();
    },
    update: function() {
      var nextScene = this.currentSceneObject.getNextScene();
      if ("own" !== nextScene) {
        PXUtil.debug_board('Now Loading...');
        switch (nextScene) {
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
      this.stats.update();
    },
    rendering: function() {
      var $__16 = this;
      if (PXConfig._FPS_ === 60) {
        requestAnimationFrame((function() {
          $__16.update();
        }));
      } else {
        setTimeout((function() {
          requestAnimationFrame((function() {
            $__16.update();
          }));
        }), 1000 / PXConfig._FPS_);
      }
      if (this.currentSceneObject.getLoadingStatus() === true) {
        this.currentSceneObject.rendering();
      }
    },
    resize: function() {
      var $__16 = this;
      PXUtil.trace_func('App::resize');
      $(window).resize((function(e) {
        var w = window.innerWidth;
        var h = window.innerHeight;
        PXUtil.trace_func('App::resize::resize w:' + w + ',h:' + h);
        $__16.renderer.setSize(w, h);
        $__16.currentSceneObject.resize();
      }));
    },
    mouseevent: function() {
      var $__16 = this;
      $(document).mousedown((function(e) {
        PXUtil.trace_func('App::mouseevent::mousedown - type' + e.type);
        $__16.currentSceneObject.mousedown(e);
      }));
    }
  }, {});
  $((function() {
    PXUtil.i18nLoad((function() {
      PXUtil.trace_func($.i18n.t('app.i18nLoadComplete'));
      var app = new Application();
      app.run();
    }));
  }));
  return {};
});
System.get("app" + '');
