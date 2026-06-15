export class AssetList {
    constructor(assets = []) {
        this.assets = assets;
    }

    addAsset(asset) {
        this.assets.push(asset);
        return this;
    }

    removeAsset(asset) {
        const index = this.assets.indexOf(asset);
        if (index > -1) {
            this.assets.splice(index, 1);
        }
        return this;
    }

    getAssets() {
        return this.assets;
    }

    getAssetsByType(type) {
        return this.assets.filter(asset => asset.type === type);
    }

    getAssetByName(name, type = null) {
        return this.assets.find(asset => {
            if (type) {
                return asset.name === name && asset.type === type;
            }
            return asset.name === name;
        });
    }

    getAssetBySrc(src) {
        return this.assets.find(asset => asset.src === src);
    }
}