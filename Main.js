import { Engine } from './engine/Engine.js';
import { Asset } from './engine/Asset.js';

const engine = new Engine({});

engine.assetList.addAsset(new Asset('debug', './assets/textures/debug.png', 'texture'));
engine.assetList.addAsset(new Asset('debug', './assets/glb/debug.glb', 'gltf'));
engine.assetList.addAsset(new Asset('debug', './assets/hdr/sky.hdr', 'hdri'));

await engine.init();