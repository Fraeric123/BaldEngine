import { Instance } from "../Instance.js";
import * as THREE from '../../../libs/three.module.js';

export class Object3DInstance extends Instance {
    constructor() {
        super();

        this.object3D = new THREE.Group();

        this.type = "transformable";
    }

    addedToWorld(world) {
        super.addedToWorld(world);
        this.world.scene.add(this.object3D);
    }

    add(object3D) {
        this.object3D.add(object3D);
        return this;
    }

    set(object3D) {
        this.object3D = object3D;
        return this;
    }

    setPosition(x, y, z) {
        this.object3D.position.set(x, y, z);
        return this;
    }

    setRotation(x, y, z) {
        this.object3D.rotation.set(x, y, z);
        return this;
    }

    setScale(x, y, z) {
        this.object3D.scale.set(x, y, z);
        return this;
    }

    setSize(scalar) {
        this.object3D.scale.set(this.object3D.scale.x * scalar, this.object3D.scale.y * scalar, this.object3D.scale.z * scalar);
        return this;
    }

    render(dt) {
        super.render(dt);
    }

    update(dt) {
        super.update(dt);
    }
}