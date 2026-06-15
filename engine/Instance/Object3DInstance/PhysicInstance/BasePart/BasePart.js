import { PhysicInstance } from "../PhysicInstance.js";
import * as THREE from '../../../../../libs/three.module.js';

export class BasePart extends PhysicInstance {
    constructor() {
        super();

        this.color = 0xffffff;
        this.texture = "debug";
        this.u_size = 1.0;
        this.v_size = 1.0;
        this.u_offset = 0.0;
        this.v_offset = 0.0;

        this._currentTextureName = null;
        this._currentTemplateTexture = null;
        this._mesh = null;
    }

    addedToWorld(world) {
        super.addedToWorld(world);

        const boxGeometry = new THREE.BoxGeometry();
        const boxMaterial = new THREE.MeshStandardMaterial({ color: this.color });

        this._mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this._mesh.name = "base_mesh";
        this._mesh.position.set(0, 0, 0);

        this.add(this._mesh);
    }

    syncVisuals() {
        if (!this._mesh) return;

        const material = this._mesh.material;

        if (material.color.getHex() !== this.color) {
            material.color.setHex(this.color);
        }

        let targetTextureAsset = null;
        if (this.world.engine && this.world.engine.assetManager) {
            targetTextureAsset = this.world.assetList.getAssetByName(this.texture, 'texture');
        }

        const targetTextureData = targetTextureAsset ? targetTextureAsset.data : null;

        if (this._currentTextureName !== this.texture || this._currentTemplateTexture !== targetTextureData) {
            this._currentTextureName = this.texture;
            this._currentTemplateTexture = targetTextureData;

            if (material.map) {
                material.map.dispose();
            }

            if (targetTextureData) {
                const newTexture = targetTextureData.clone();
                newTexture.magFilter = THREE.NearestFilter;
                newTexture.minFilter = THREE.NearestMipmapLinearFilter;
                newTexture.wrapS = THREE.RepeatWrapping;
                newTexture.wrapT = THREE.RepeatWrapping;

                material.map = newTexture;
            } else {
                material.map = null;
            }
            material.needsUpdate = true;
        }

        if (material.map) {
            const map = material.map;

            if (map.repeat.x !== this.u_size || map.repeat.y !== this.v_size) {
                map.repeat.set(this.u_size, this.v_size);
            }

            if (map.offset.x !== this.u_offset || map.offset.y !== this.v_offset) {
                map.offset.set(this.u_offset, this.v_offset);
            }
        }
    }

    setColor(color) {
        this.color = color;
    }

    setTextureId(textureId) {
        this.texture = textureId;
    }

    setUSize(size) {
        this.u_size = size;
    }

    setVSize(size) {
        this.v_size = size;
    }

    setUOffset(offset) {
        this.u_offset = offset;
    }

    setVOffset(offset) {
        this.v_offset = offset;
    }

    setU(size, offset) {
        this.setUSize(size);
        this.setUOffset(offset);
    }

    setV(size, offset) {
        this.setVSize(size);
        this.setVOffset(offset);
    }

    setUV(u_size, u_offset, v_size, v_offset) {
        this.setU(u_size, u_offset);
        this.setV(v_size, v_offset);
    }

    render(dt) {
        this.syncVisuals();
        super.render(dt);
    }

    update(dt) {
        super.update(dt);
    }
}