import { Manager } from "./Manager.js"
import * as THREE from "../../libs/three.module.js"

export class CanvasManager extends Manager {
    constructor(engine) {
        super(engine);

        this.engine = engine;

        this.renderWidth = 2560;
        this.renderHeight = 1440;

        this.GUICanvas = null;
        this.RenderCanvas = null;
        this.GUICanvasContext = null;
    }

    resize() {
        const width = window.innerWidth;
        const height = width * 9 / 16;

        const scaleX = width / this.renderWidth;
        const scaleY = height / this.renderHeight;

        [this.RenderCanvas, this.GUICanvas].forEach(canvas => {
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            canvas.width = Math.floor(width);
            canvas.height = Math.floor(height);
        });

        if (this.engine.renderer) {
            this.engine.renderer.setSize(Math.floor(width), Math.floor(height), false);
        }

        if (this.engine.world && this.engine.world.camera) {
            this.engine.world.camera.aspect = width / height;
            this.engine.world.camera.updateProjectionMatrix();
        }

        this.GUICanvasContext.setTransform(
            scaleX, 0,
            0, scaleY,
            0, 0
        );
    }

    fix_canvas(canvas, zIndex) {
        canvas.style.position = 'fixed';
        canvas.style.zIndex = zIndex;
        canvas.style.display = 'block';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
    }

    init() {
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.backgroundColor = this.engine.bodyColor;

        this.engine.GUICanvas = document.createElement('canvas');
        this.engine.RenderCanvas = document.createElement('canvas');

        this.GUICanvas = this.engine.GUICanvas;
        this.RenderCanvas = this.engine.RenderCanvas;

        document.body.appendChild(this.GUICanvas);
        document.body.appendChild(this.RenderCanvas);

        this.engine.renderer = new THREE.WebGLRenderer({
            canvas: this.RenderCanvas,
            antialias: true
        });

        this.fix_canvas(this.engine.RenderCanvas, 0);
        this.fix_canvas(this.engine.GUICanvas, 1);

        this.GUICanvasContext = this.GUICanvas.getContext('2d');

        this.RenderCanvas.style.pointerEvents = 'none';
        this.GUICanvas.style.pointerEvents = 'auto';

        this.GUICanvas.style.outline = '1px solid blue';

        window.addEventListener('resize', this.resize.bind(this));

        this.resize();
    }

    update(dt) {

    }
}