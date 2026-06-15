import { PhysicInstance } from "../PhysicInstance.js";
import * as THREE from '../../../../../libs/three.module.js';

export class BasePart extends PhysicInstance {
    constructor() {
        super();
    }

    addedToWorld(world) {
        super.addedToWorld(world);

        const boxGeometry = new THREE.BoxGeometry();

        let textureMap = null;
        if (this.world.engine && this.world.engine.assetManager) {
            const asset = this.world.assetList.getAssetByName('texture');
            if (asset && asset.data) {
                textureMap = asset.data;
            }
        }

        const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: textureMap
        });

        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.set(0, 0, 0);

        this.add(boxMesh);
    }

    render(dt) {
        super.render(dt);
    }

    update(dt) {
        super.update(dt);

        if (this.object3D) {
            this.object3D.rotation.x += 1 * dt;
            this.object3D.rotation.y += 0.5 * dt;
        }
    }
}