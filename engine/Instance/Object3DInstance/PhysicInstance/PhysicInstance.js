import { Object3DInstance } from "../Object3DInstance.js";
import { AABB } from "../../../Phys/AABB.js";
import * as THREE from '../../../../libs/three.module.js';

export class PhysicInstance extends Object3DInstance {
    constructor() {
        super();

        this.aabb = new AABB(0, 0, 0, 0, 0, 0);

        this.type = "physical"
    }

    addedToWorld(world) {
        super.addedToWorld(world);
    }

    render(dt) {
        super.render(dt);
    }

    update(dt) {
        super.update(dt);
    }
}