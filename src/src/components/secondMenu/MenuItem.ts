
enum BUTTON_TYPE {
    NONE,
    SINGLE,
    DOUBLE,
}

class MenuItem {
    private title: string;
    private type: BUTTON_TYPE;
    private currentState: number;
    private images: object[];

    constructor(title: string, type: BUTTON_TYPE, images?: object[]) {
        this.currentState = 0;
        this.title = title;
        this.type = type;
        this.images =
            this.type === BUTTON_TYPE.NONE ? null : images;
    }

    public getTitle() {
        return this.title;
    }

    public getImage() {
        return this.images ? this.images[this.currentState] : null;
    }

    public getState() {
        return this.currentState;
    }

    public nextState() {
        if (this.type !== BUTTON_TYPE.NONE) {
            this.currentState = this.currentState % this.type + 1;
        }
    }

    public resetState() {
        this.currentState = 0;
    }
}

export { BUTTON_TYPE, MenuItem};
