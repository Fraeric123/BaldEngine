export class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vec) {
        return new Vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    sub(vec) {
        return new Vec3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    mul(scalar) {
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    div(scalar) {
        return new Vec3(this.x / scalar, this.y / scalar, this.z / scalar);
    }
}