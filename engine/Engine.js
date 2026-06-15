import { World } from "./World/World.js"
import { AssetManager } from "./Manager/AssetManager.js"
import { CanvasManager } from "./Manager/CanvasManager.js"
import { AssetList } from "./AssetList.js"
import * as THREE from "../libs/three.module.js"

export class Engine {
    constructor({ startWorld = new World(), assetList = new AssetList() }) {
        this.assetList = assetList;

        this.world = startWorld;

        this.assetManager = new AssetManager(this);
        this.canvasManager = new CanvasManager(this);
        this.inputManager = null;

        this.renderer = null;

        this.GUICanvas = null;
        this.RenderCanvas = null;
        this.GUICanvasContext = null;

        this.worldUpdates = false;
        this.worldRender = false;

        this.bodyColor = '#000000';

        this.lastTime = 0;
    }

    async init() {
        this.canvasManager.init();

        await this.assetManager.loadAssets();

        this.world.init(this);

        this.worldUpdates = true;
        this.worldRender = true;

        this.canvasManager.resize();

        requestAnimationFrame(this.loop.bind(this));
    }

    render(dt) {
        if (this.worldRender) {
            this.world.render(dt);
        }
    }

    loop(time) {
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        if (this.worldUpdates) {
            this.world.update(dt);
        }

        this.canvasManager.update(dt);

        this.render(dt);
        requestAnimationFrame(this.loop.bind(this));
    }
}