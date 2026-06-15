import { Manager } from "./Manager.js"
import { Asset } from "../Asset.js"
import { GLTFLoader } from "../../../libs/GLTFLoader.js"
import { RGBELoader } from "../../../libs/RGBELoader.js"
import * as THREE from "../../../libs/three.module.js"

export class AssetManager extends Manager {
    constructor(engine) {
        super(engine);
        
        this.engine = engine;

        this.textureLoader = new THREE.TextureLoader();
        this.soundLoader = new THREE.AudioLoader();
        this.gltfLoader = new GLTFLoader();
        this.rgbeLoader = new RGBELoader();

        this.promises = [];
        this.totalAssets = this.engine.assetList.getAssets().length;
        this.loadedAssets = 0;
    }
    
    async loadAssets() {
        this.totalAssets = this.engine.assetList.getAssets().length;
        this.loadedAssets = 0;

        const onProgress = (asset) => {
            this.loadedAssets++;
            const percent = (this.loadedAssets / this.totalAssets) * 100;
            console.log(`Loaded ${asset.name} ${asset.src} (${percent.toFixed(2)}%)`);
        };

        for (const asset of this.engine.assetList.getAssets()) {
            if (asset.loaded && asset.data) {
                onProgress(asset);
                continue;
            }
            const promise = new Promise((resolve, reject) => {
                if (asset.type === "texture") {
                    this.textureLoader.load(asset.src, (data) => {
                        asset.data = data;
                        onProgress(asset);
                        resolve();
                    }, undefined, reject);
                } else if (asset.type === "gltf") {
                    this.gltfLoader.load(asset.src, (data) => {
                        asset.data = data;
                        onProgress(asset);
                        resolve();
                    }, undefined, reject);
                } else if (asset.type === "rgbe") {
                    this.rgbeLoader.load(asset.src, (data) => {
                        asset.data = data;
                        onProgress(asset);
                        resolve();
                    }, undefined, reject);
                } else if (asset.type === "audio") {
                    this.soundLoader.load(asset.src, (data) => {
                        asset.data = data;
                        onProgress(asset);
                        resolve();
                    }, undefined, reject);
                } else {
                    reject(new Error(`Unsupported asset type: ${asset.type}`));
                }
            });
            this.promises.push(promise);
            await new Promise(r => setTimeout(r, 200));
        }

        await Promise.all(this.promises);

        await new Promise(r => setTimeout(r, 200));
    }
}