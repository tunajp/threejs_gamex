/*
 * terrain.js
 *
 * @author Mitsunori Inaba <m-inaba@phoenixdesign.jp>
 */

module PXUtil from '../util';
module PXConfig from '../config';

/**
 * Terrain class
 */
export class Terrain
{
  constructor(callback_function)
  {
    PXUtil.trace_func('Terrain::constructor');

    this.mesh;

    this.callback_function = callback_function;

    var FLOOR = -1000;
    var img = new Image();
    var obj = this;
    img.onload = function(){
      var data = obj.getHeightData(img);
      // plane
      var plane = new THREE.PlaneGeometry(100, 100, 127, 127);
      for (var i=0, l= plane.vertices.length; i<l; i++) {
        plane.vertices[i].z = data[i]; // http://stackoverflow.com/questions/11459104/vertices-in-a-plane-have-no-position
      }
      obj.mesh = obj.addMesh(plane, 100, 0, FLOOR, 0, -1.57, 0, 0, obj.getTerrainMaterial());

      //obj.mesh.castShadow = true;
      obj.mesh.receiveShadow = true;

      obj.callback_function(obj.mesh);
    };
    img.src = PXConfig._ASSETS_PATH_ + 'heightmap/heightmap_128.jpg';

    var water = new THREE.PlaneGeometry(100, 100, 1, 1);
    for (var i=0; i<water.faces.length; i++) {
      var uvs = water.faces[1];
      for (var j = 0, jl = uvs.length; j < jl; j++) {
        uvs[j].u *= 10;
        uvs[j].v *= 10;
      }
    }
    var waterMesh = this.addMesh( water, 63,  -1000, FLOOR+620, 1000, -1.57,0,0, this.getWaterMaterial() );
    //waterMesh.visible = false;
  }

  getMesh()
  {
    return this.mesh;
  }

  getHeightData(img)
  {
    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    var context = canvas.getContext('2d');
    var size = 128 * 128;
    var data = new Float32Array(size);
    context.drawImage(img, 0 ,0);
    for (var i=0; i<size; i++) {
      data[i] = 0;
    }
    var imgd = context.getImageData(0, 0, 128, 128);
    var pix = imgd.data;
    var j=0;
    for (var i=0, n=pix.length; i<n; i+=(4)) {
      var all = pix[i] + pix[i+1] + pix[i+2];
      data[j++] = all/30;
    }
    return data;
  }

  addMesh(geometry, scale, x, y, z, rx, ry, rz, material)
  {
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
  }

  getTerrainMaterial()
  {
    var terrainMaterial = new THREE.MeshPhongMaterial( { map: new THREE.Texture(null, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping), ambient: 0xaaaaaa, specular: 0xffffff, shininess: 0, shading: THREE.SmoothShading } );

    terrainMaterial.map = THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + "heightmap/terrain.jpg");

    return terrainMaterial;
  }

  getWaterMaterial()
  {
    var waterMaterial = new THREE.MeshPhongMaterial( { map: new THREE.Texture(null, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping), ambient: 0x666666, specular: 0xffffff, /*env_map: textureCube, *//*combine: THREE.Mix, */reflectivity: 0.15 , /*opacity: 0.8, */shininess: 10, shading: THREE.SmoothShading } );

    waterMaterial.map = THREE.ImageUtils.loadTexture(PXConfig._ASSETS_PATH_ + "heightmap/water.jpg");
    return waterMaterial;
  }

  /**
   * rendering method
   */
  rendering(delta)
  {
  }
}
