export class ElasticPane {
  public element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public applyWidthPercentage(percentage: number) {
    this.element.style.width = `${percentage}%`;
  }
}
