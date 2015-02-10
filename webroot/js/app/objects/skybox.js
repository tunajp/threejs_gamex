/*
 * Skybox.js
 *
 * @author Mitsunori Inaba <m-inaba@phoenixdesign.jp>
 */

import * as PXUtil from '../util.js';
import * as PXConfig from '../config.js';

/**
 * Skybox class
 */
export class Skybox
{
  /**
   * constructor
   */
  constructor(callback_function)
  {
    PXUtil.trace_func('Skybox::constructor');

    this.callback_function = callback_function;

    var skyGeometry = new THREE.BoxGeometry(5000*3, 5000*3, 5000*3);
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
  }
}
