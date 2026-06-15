export class Asset {
    constructor(name, src, type = null) {
        this.name = name;
        this.src = src;
        this.type = type;
        this.data = null;
        this.loaded = false;
    }
}