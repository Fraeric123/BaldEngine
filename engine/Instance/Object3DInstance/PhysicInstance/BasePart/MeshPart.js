import { PhysicInstance } from "../PhysicInstance.js";
import * as THREE from '../../../../../libs/three.module.js';

export class MeshPart extends PhysicInstance {
    constructor() {
        super();

        this.meshId = "debug";
        this.color = 0xffffff;
        this.texture = "";
        this.u_size = 1.0;
        this.v_size = 1.0;
        this.u_offset = 0.0;
        this.v_offset = 0.0;

        this.meshPositionOffset = new THREE.Vector3(0, 0, 0);
        this.meshRotationOffset = new THREE.Vector3(0, 0, 0);

        this._currentMeshId = null;
        this._currentTemplateModel = null;
        this._currentTextureName = null;
        this._currentTemplateTexture = null;
        this._currentMeshPositionOffset = null;
        this._currentMeshRotationOffset = null;

        this._modelContainer = null;
    }

    addedToWorld(world) {
        super.addedToWorld(world);

        this._modelContainer = new THREE.Group();
        this.add(this._modelContainer);
    }

    syncVisuals() {
        let targetModelAsset = null;
        let targetTextureAsset = null;

        if (this.world.engine && this.world.engine.assetManager) {
            targetModelAsset = this.world.assetList.getAssetByName(this.meshId, 'gltf');
            targetTextureAsset = this.world.assetList.getAssetByName(this.texture, 'texture');
        }

        const targetModelData = targetModelAsset ? targetModelAsset.data : null;
        const targetTextureData = targetTextureAsset ? targetTextureAsset.data : null;

        if (this._currentMeshId !== this.meshId || this._currentTemplateModel !== targetModelData) {
            this._currentMeshId = this.meshId;
            this._currentTemplateModel = targetModelData;

            while (this._modelContainer.children.length > 0) {
                this._modelContainer.remove(this._modelContainer.children[0]);
            }

            this._currentTextureName = null;

            if (targetModelData && targetModelData.scene) {
                const clonedScene = targetModelData.scene.clone();

                clonedScene.name = "base_mesh";

                clonedScene.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: this.color
                        });
                    }
                });

                this._modelContainer.add(clonedScene);
            }
        }

        if (this._currentMeshPositionOffset !== this.meshPositionOffset || this._currentMeshRotationOffset !== this.meshRotationOffset) {
            this._modelContainer.children[0].position.set(this.meshPositionOffset.x, this.meshPositionOffset.y, this.meshPositionOffset.z);
            this._modelContainer.children[0].rotation.set(this.meshRotationOffset.x, this.meshRotationOffset.y, this.meshRotationOffset.z);
        }

        let textureChanged = this._currentTextureName !== this.texture || this._currentTemplateTexture !== targetTextureData;
        if (textureChanged) {
            this._currentTextureName = this.texture;
            this._currentTemplateTexture = targetTextureData;
        }

        this._modelContainer.traverse((child) => {
            if (child.isMesh && child.material) {
                const material = child.material;

                if (material.color.getHex() !== this.color) {
                    material.color.setHex(this.color);
                }

                if (textureChanged) {
                    if (material.map) {
                        material.map.dispose();
                    }

                    if (targetTextureData) {
                        const newTexture = targetTextureData.clone();
                        newTexture.magFilter = THREE.NearestFilter;
                        newTexture.minFilter = THREE.NearestFilter;
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
        });
    }

    setColor(color) {
        this.color = color;
    }

    setTextureId(textureId) {
        this.texture = textureId;
    }

    setMeshId(meshId) {
        this.meshId = meshId;
    }

    setMeshPositionOffset(x, y, z) {
        this.meshPositionOffset.set(x, y, z);
    }

    setMeshRotationOffset(x, y, z) {
        this.meshRotationOffset.set(x, y, z);
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

        if (this.object3D) {
            this.object3D.rotation.y -= 2 * dt;
        }
    }
}