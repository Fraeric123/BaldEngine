import { Instance } from "../Instance/Instance.js"
import { System } from "./System/System.js"
import { BasePart } from "../Instance/Object3DInstance/PhysicInstance/BasePart/BasePart.js";
import { MeshPart } from "../Instance/Object3DInstance/PhysicInstance/BasePart/MeshPart.js";
import * as THREE from "../../../libs/three.module.js"

export class World {
    constructor() {
        this.engine = null;

        this.assetList = null;

        this.instances = [];

        this.camera = null;
        this.scene = new THREE.Scene();
    }

    init(engine) {
        this.engine = engine;
        this.assetList = engine.assetList;

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.scene.add(this.camera);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        this.addInstance(new BasePart()).setPosition(-2, 0, 0).setSize(2);

        const customModel = new MeshPart();
        customModel.meshId = "debug";
        customModel.color = 0xff0000;
        this.addInstance(customModel).setPosition(2, 0, 0).setSize(1);

        this.setSkyFromHDRI("debug");
        this.setBrightness(0.5);
    }

    addInstance(instance) {
        this.instances.push(instance);
        instance.addedToWorld(this);
        return instance;
    }

    removeInstance(instance) {
        if (instance.remove()) {
            const index = this.instances.indexOf(instance);
            if (index > -1) {
                this.instances.splice(index, 1);
                instance.world = null;
            }
        }
    }

    setBrightness(num = 1.0) {
        this.engine.renderer.toneMappingExposure = num;
    }

    setSkyFromHDRI(assetId, type = "hdri") {
        const asset = this.assetList.getAssetByName(assetId, type);
        if (asset && asset.data) {
            const texture = asset.data;
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = texture;
            this.scene.environment = texture;
        }
    }

    setSkyFromCubeMap(rightId, leftId, topId, bottomId, frontId, backId, type = 'texture') {
        const assetIds = [
            rightId,
            leftId,
            topId,
            bottomId,
            frontId,
            backId
        ];

        const images = [];

        for (let id of assetIds) {
            if (id == undefined) { id = "debug" }

            const asset = this.assetList.getAssetByName(id, type);

            if (asset && asset.data) {
                images.push(asset.data.image || asset.data);
            } else {
                return;
            }
        }

        const cubeTexture = new THREE.CubeTexture(images);
        cubeTexture.needsUpdate = true;

        this.scene.background = cubeTexture;
        this.scene.environment = cubeTexture;
    }

    render(dt) {
        this.engine.renderer.render(this.scene, this.camera);

        for (const instance of this.instances) {
            instance.render(dt);
        }
    }

    update(dt) {
        for (const instance of this.instances) {
            instance.update(dt);
        }
    }
}