import { Engine } from './engine/Engine.js';
import { Asset } from './engine/Asset.js';

const engine = new Engine({});

engine.assetList.addAsset(new Asset('texture', './assets/textures/texture.png', 'texture'));

await engine.init();