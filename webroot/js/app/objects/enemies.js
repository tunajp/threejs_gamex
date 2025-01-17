/*
 * enemies.js
 *
 * @author Mitsunori Inaba <m-inaba@phoenixdesign.jp>
 */

import * as PXUtil from '../util.js';
import * as PXConfig from '../config.js';

/**
 * Sprite class
 */
class Sprite
{
  constructor(message, callback_function)
  {
    PXUtil.trace_func('Sprite::constructor');

    this.callback_function = callback_function;

    this.sprite = this.makeTextSprite(message, { fontsize: 24, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8} } );
    //this.sprite.position.set(-85,105,55);

    this.callback_function(this.sprite);
  }

  getSprite()
  {
    return this.sprite;
  }

  setPositionVector3(/*THREE.Vector3 */v)
  {
    this.sprite.position.set(v.x, v.y, v.z);
  }

  setPosition(x, y, z)
  {
    this.sprite.position.set(x, y, z);
  }

  /**
   * rendering method
   */
  rendering(delta)
  {
  }

  updateSprite( message, parameters)
  {
    if ( parameters === undefined ) parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ? 
      parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? 
      parameters["fontsize"] : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
      parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ?
      parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
      parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

    // get size data (height depends only on font size)
    var metrics = this.context.measureText( message );
    var textWidth = metrics.width;

    // background color
    this.context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                                  + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    this.context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                                  + borderColor.b + "," + borderColor.a + ")";

    this.context.lineWidth = borderThickness;
    this.roundRect(this.context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    // text color
    this.context.fillStyle = "rgba(0, 0, 0, 1.0)";

    this.context.fillText( message, borderThickness, fontsize + borderThickness);

    this.texture.needsUpdate = true;
  }

  /**
   * makeTextSprite method
   * http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
   */
  makeTextSprite( message, parameters )
  {
    if ( parameters === undefined ) parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ? 
      parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? 
      parameters["fontsize"] : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
      parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ?
      parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
      parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

    //var spriteAlignment = THREE.SpriteAlignment.topLeft;
      
    var canvas = document.createElement('canvas');
    //var context = canvas.getContext('2d');
    this.context = canvas.getContext('2d');
    this.context.font = "Bold " + fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    var metrics = this.context.measureText( message );
    var textWidth = metrics.width;

    // background color
    this.context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                                  + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    this.context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                                  + borderColor.b + "," + borderColor.a + ")";

    this.context.lineWidth = borderThickness;
    this.roundRect(this.context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    // text color
    this.context.fillStyle = "rgba(0, 0, 0, 1.0)";

    this.context.fillText( message, borderThickness, fontsize + borderThickness);

    // canvas contents will be used for a texture
    //var texture = new THREE.Texture(canvas) 
    this.texture = new THREE.Texture(canvas) 
    this.texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( 
      { map: this.texture, useScreenCoordinates: false/*, alignment: spriteAlignment*/ } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(100,50,1.0);
    return sprite;	
  }

  /**
   * function for drawing rounded rectangles
   * http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
   */
  roundRect(ctx, x, y, w, h, r) 
  {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();   
  }
}

/**
 * Enemy class
 */
class Enemy
{
  /*
   * constructor
   */
  constructor()
  {
    //
    // private member
    //
    /** Name */
    this.name = "";
    /** MAXHP */
    this.maxhp = 100;
    /** HP */
    this.hp = 100;
    /** MAXMP? */
    this.maxmp = 0;
    /** MP? */
    this.mp = 0;
    /** 弾のMAX */
    this.maxammo = 10;
    /** 弾の残り数 */
    this.ammo = 10;
    /** ステータス */
    this.status =null;
    /** MD2Characterオブジェクト */
    this.character = null;
    /** 巡回点配列(XZ)(-500->500) */
    this.target_positions_array = null;
    /** 今どの巡回点に向かっているか(index指定) */
    this.target_position_index = 0;
    /** sleep or awake */
    /** target helo character */
    /** current animation */
    this.current_animation = "idol";
    /** sprite */
    this.sprite = null;
    /** y座標の調整タイミング */
    this.y_timing = Math.floor(Math.random()) * 10; // 0-10
    /** 0-10*/
    this.timing = 0;
  }

  calcDistance(x1,y1,x2,y2)
  {
    var a, b, d;
    a = x1 - x2;
    b = y1 - y2;
    d = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
    return d;
  }

  /**
   * rendering method
   */
  rendering(delta, ground_collision_array)
  {
    //this.character.setAnimation('run');//
    //console.log(this.character.root.position.x + "," + this.character.root.position.z);

    // 巡回点の方向に向かせる
    var target_position = new THREE.Vector3(
      this.target_positions_array[this.target_position_index].x,
      this.character.root.position.y,
      this.target_positions_array[this.target_position_index].z
      );
    //this.character.root.parent.worldToLocal(target_position);
    this.character.root.lookAt(target_position); // lookAtで方向転換させるために、MD2CharacterComplex.jsのthis.root.rotation.y = this.bodyOrientation;をコメントアウト
    //console.log(target_position.x + "," + target_position.z);

    // 巡回点に向かって歩かせる
    var distance = this.calcDistance(this.character.root.position.x, this.character.root.position.z, target_position.x, target_position.z);
    //console.log(distance);
    var moveDistance = 200 * delta / 10; // 200 pixels per second  // should be velocity?
    //this.character.root.translateX( moveDistance );
    this.character.root.translateZ( moveDistance );

    // 巡回点に近づいたら、次の巡回点をターゲットにする
    if (distance < 10.0) {
      if (this.target_position_index+1 >= this.target_positions_array.length) {
        this.target_position_index = 0;
      } else {
        this.target_position_index++;
      }
    }

    /*
     * キャラクタのy座標設定
     * 毎フレーム一匹ずつrayを出して処理するとめちゃ遅い
     * 10匹出して20FPSとかなので、余裕で主人公がジャンプした際に落下する
     * なので、randomで数フレームに1回だけy座標調整する
     */
    if (this.timing == this.y_timing) {
      var ray = new THREE.Raycaster();
      ray.ray.direction.set(0, -1, 0);
      // キャラクターのx,z座標(yはキャラの頭の位置ぐらいでいいかも,あまり低いと落下するかも)
      var person_point = new THREE.Vector3(this.character.root.position.x, this.character.root.position.y + 200, this.character.root.position.z);
      // 下にrayを出してキャラクタのいるべきy座標を得る
      ray.ray.origin.copy(person_point);
      var intersects = ray.intersectObjects(ground_collision_array);
      if (intersects.length > 0) {
        //!一番初めにヒットしたy座標にキャラクタを移動する
        this.character.root.position.y = intersects[0].point.y + 8;
      }
    }

    // sprite update
    this.sprite.updateSprite(" " + this.name + " HP:"+ this.hp-- + "/" + this.maxhp + " ", { fontsize: 24, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8} });

    // spriteも同時に移動
    this.sprite.setPosition(
      this.character.root.position.x,
      this.character.root.position.y+30,
      this.character.root.position.z
      );

    this.character.update(delta);

    this.timing++;
    if (this.timing > 10) {
      this.timing = 0;
    }
  }
}

/**
 * Enemies class
 * 敵小隊クラス
 */
export class Enemies
{
  /**
   * constructor
   * パラメータ：キャラクタ数、地面、プレイヤー
   */
  constructor(nCharacters, callback_function)
  {
    PXUtil.trace_func('Enemies::constructor');

    var config = {
      baseUrl: PXConfig._ASSETS_PATH_ + "models/ogro/",
      body: "ogro-light.js",
      skins: ["grok.jpg", "ogrobase.png", "arboshak.png", "ctf_r.png", "ctf_b.png", "darkam.png", "freedom.png", "gib.png", "gordogh.png", "igdosh.png", "khorne.png", "nabogro.png"],
      weapons:  [ [ "weapon-light.js", "weapon.jpg" ] ],
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

    //
    // private member
    //
    /** characters array */
    this.callback_function = callback_function;
    this.characters = new Array();
    this.cloneCharacterRoots = new Array();
    this.sprites = new Array();

    /*
     * clones
     */
    for (var i=0; i< nCharacters; i++) {
      var character = new THREE.MD2CharacterComplex();
      character.scale = 1/3;//3;
      character.controls = controls;

      var enemy = new Enemy();
      enemy.character = character;
      // 巡回点作成(field上ではこのようにランダムでいい、ダンジョンの場合は設計する事)
      enemy.target_positions_array = new Array();
      for (var j=0; j< 3; j++) {
        var x = Math.floor(Math.random()*300) +200;
        var z = Math.floor(Math.random()*300) +600;
        enemy.target_positions_array.push({x:x, z:z});
      }
      enemy.name = "モンスター" + i;
      // sprite
      var sprite = new Sprite(" " + enemy.name + " HP:"+ enemy.hp + "/" + enemy.maxhp + " ", ()=>{});
      enemy.sprite = sprite;

      this.characters.push(enemy);
    }

    /*
     * base(通常のMD2と基本は同じ)
     */
    var baseCharacter = new THREE.MD2CharacterComplex();
    baseCharacter.scale = 1/2;
    var obj = this;
    baseCharacter.onLoadComplete = function() {
      for (var i=0; i<nCharacters; i++) {
        /*
         * baseからcloneへ分配
         */
        var cloneCharacter = obj.characters[i].character;
        cloneCharacter.shareParts(baseCharacter);
        cloneCharacter.enableShadows(true);
        cloneCharacter.setWeapon(0);
        cloneCharacter.setSkin(i);

        cloneCharacter.frontAcceleration = 0;
        cloneCharacter.controls.moveForward = true;

        cloneCharacter.root.position.x = Math.floor(Math.random()*300) +200;
        cloneCharacter.root.position.y = 300;
        cloneCharacter.root.position.z = Math.floor(Math.random()*300) +600;

        obj.cloneCharacterRoots.push(cloneCharacter.root);
        obj.sprites.push(obj.characters[i].sprite.getSprite());
      }
      obj.callback_function(obj.cloneCharacterRoots, obj.sprites);
    };
    baseCharacter.loadParts(config);
  }

  /**
   * rendering method
   */
  rendering(delta, ground_collision_array)
  {
    for (var i=0; i<this.characters.length; i++) {
      this.characters[i].rendering(delta, ground_collision_array);
    }
  }
}
