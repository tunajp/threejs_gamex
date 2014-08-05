/*
 * ratamahatta.js
 *
 * @author Mitsunori Inaba <m-inaba@phoenixdesign.jp>
 */

import * as PXUtil from '../util';
import * as PXConfig from '../config';

/**
 * Ratamahatta class
 */
export class Ratamahatta
{
  /**
   * constructor
   */
  constructor(scale, callback_function)
  {
    PXUtil.trace_func('Ratamahatta::constructor');

    this.cur_animation = null;

    var config = {
      baseUrl: PXConfig._ASSETS_PATH_ + "models/ratamahatta/",
      body: "ratamahatta.js",
      skins: [ "ratamahatta.png", "ctf_b.png", "ctf_r.png", "dead.png", "gearwhore.png" ],
      weapons:  [  [ "weapon.js", "weapon.png" ],
             [ "w_bfg.js", "w_bfg.png" ],
             [ "w_blaster.js", "w_blaster.png" ],
             [ "w_chaingun.js", "w_chaingun.png" ],
             [ "w_glauncher.js", "w_glauncher.png" ],
             [ "w_hyperblaster.js", "w_hyperblaster.png" ],
             [ "w_machinegun.js", "w_machinegun.png" ],
             [ "w_railgun.js", "w_railgun.png" ],
             [ "w_rlauncher.js", "w_rlauncher.png" ],
             [ "w_shotgun.js", "w_shotgun.png" ],
             [ "w_sshotgun.js", "w_sshotgun.png" ]
            ]
    };

    //
    // private member
    //
    this.callback_function = callback_function;
    this.character = new THREE.MD2Character();

    this.character.scale = scale;
    var obj = this;
    this.character.onLoadComplete = function() {
      //var animations = obj.character.meshBody.geometry.animations;
      obj.setSkin(0);
      obj.setWeapon(0);
      obj.setAnimation('stand');
      obj.cur_animation = 'stand';
      callback_function(obj.character.root, obj);
    }
    this.character.loadParts(config);
  }

  /**
   * rendering method
   */
  rendering(delta)
  {
    //this.mesh.rotation.y += delta;
    this.character.update(delta);
  }

  /**
   * getRatamahatta method
   */
  getRatamahatta()
  {
    return this.character;
  }

  /**
   * setAnimation method * @param {type} name 'stand','run','attack','pain','jump','flip','falute','taunt','wave','point','crstand','crwalk',crattack','crpain','crdeath','death'
   */
  setAnimation(name)
  {
    this.cur_animation = name;
    this.character.setAnimation(name);
  }

  getAnimation()
  {
    return this.cur_animation;
  }

  /**
   * setSkin method
   * @param {type} name 'ratamahatta','ctf_b','ctf_r','dead','gearwhore'
   */
  setSkin(index)
  {
    this.character.setSkin(index);
  }

  /**
   * setWeapon method
   * @param {type} name 'none','weapon','w_bfg','w_blaster','w_chaingun','w_glauncher','w_hyperblaster','w_machinegun','w_railgun','w_rlauncher','w_shotgun','w_sshotgun'
   */
  setWeapon(index)
  {
    this.character.setWeapon(index);
  }
}
