import * as THREE from '../../../libs/three.module.js';

export class Instance {
    constructor() {
        this.world = null;

        this.uuid = THREE.MathUtils.generateUUID();

        this.parent = null;
        this.children = [];

        this.type = "abstract";
    }

    addedToWorld(world) {
        this.world = world;
    }

    addChild(child) {
        this.children.push(child);
        child.parent = this;
        child.addedToWorld(this.world);
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parent = null;
            child.world = null;
        }
    }

    removeChildByUUID(uuid) {
        const child = this.children.find(child => child.uuid === uuid);
        if (child) {
            this.removeChild(child);
        }
    }

    removeChildByIndex(index) {
        if (index >= 0 && index < this.children.length) {
            const child = this.children[index];
            this.removeChild(child);
        }
    }

    getChildByUUID(uuid) {
        return this.children.find(child => child.uuid === uuid);
    }

    getChildren() {
        return this.children;
    }

    getDecendants() {
        let decendants = [];
        for (const child of this.children) {
            decendants.push(child);
            decendants = decendants.concat(child.getDecendants());
        }
        return decendants;
    }

    remove() {
        for (const child of this.children) {
            child.remove();
        }
        this.children = [];
        return true;
    }

    render(dt) {
        for (const child of this.children) {
            child.render(dt);
        }
    }

    update(dt) {
        for (const child of this.children) {
            child.update(dt);
        }
    }
}
