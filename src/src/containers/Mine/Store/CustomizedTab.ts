export enum ORDER {
  ASC,
  DESC,
}

class CustomizedTab {
  private text: string;
  private showImage: boolean;
  private order: ORDER;
  private active: boolean;

  public constructor(text: string = '', showImage: boolean = false, order: ORDER = ORDER.ASC, active: boolean = false) {
    this.text = text;
    this.showImage = showImage;
    this.order = order;
    this.active = active;
  }

  public getText(): string {
    return this.text;
  }

  public setText(text: string): void {
    this.text = text;
  }

  public ifShowImage(): boolean {
    return this.showImage;
  }

  public setWhetherShowImage(ifShowImage: boolean): void {
    this.showImage = ifShowImage;
  }

  public getOrder(): ORDER {
    return this.order;
  }

  public setOrder(order: ORDER) {
    this.order = order;
  }

  public isActive(): boolean {
    return this.active;
  }

  public setActive(active: boolean): void {
    this.active = active;
  }
}

export default CustomizedTab;
