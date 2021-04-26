import { Component, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('NodesContainer') nodesContainerRef: ElementRef;
  @ViewChild('Nodes') nodesRef;

  private nodeAnimationTimeout: number = 1000;
  private pointerAnimationTimeout: number = 800;
  private deleteTimeout: number = 1000;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.addNode(0, 1);
  }

  public async addNode(i: number, data: number) {

    // if (checkInputErrors(i, "Index") || checkInputErrors(data, "Data")) // Todo
    //   return;

    if (!data) return;

    const children = this.nodesContainerRef.nativeElement.children;

    // nodeBox
    let nodeBox = this.renderer.createElement('div');
    this.renderer.addClass(nodeBox, 'node-box');
    this.renderer.addClass(nodeBox, 'fx-row-cc');

    // nodeItem
    let nodeItem = this.renderer.createElement('div');
    this.renderer.addClass(nodeItem, 'node-item');
    this.renderer.addClass(nodeItem, 'fx-row-cc');
    let text = this.renderer.createText(String(data));
    this.renderer.appendChild(nodeItem, text);

    // nodePointer
    let nodePointer = this.renderer.createElement('div');
    this.renderer.addClass(nodePointer, 'node-pointer');
    this.renderer.addClass(nodePointer, 'fx-row-cc');
    this.renderer.setStyle(nodePointer, 'opacity', 0);

    let line = this.renderer.createElement('div');
    this.renderer.addClass(line, 'line');

    let arrowRight = this.renderer.createElement('i');
    this.renderer.addClass(arrowRight, 'arrow-right');

    this.renderer.appendChild(nodePointer, line);
    this.renderer.appendChild(nodePointer, arrowRight);

    this.renderer.appendChild(nodeBox, nodeItem);
    this.renderer.appendChild(nodeBox, nodePointer);

    if (i === children.length) {
      await this.animateNodes(0, children.length - 1, children);
      this.renderer.appendChild(this.nodesContainerRef.nativeElement, nodeBox);
    }
    else {
      // Todo insert
      // await this.animateNodes(0, i - 1);
      // await this.animateNodesBeforeInsert(i, nodes.length)
      // this.nodesContainer.insertBefore(pointer, nodes[i]);
      // this.nodesContainer.insertBefore(node, pointer);
    }

    nodeItem.style.animation =
      "grow " +
      this.nodeAnimationTimeout / 1000 + "s " +
      "ease";

    setTimeout(() => {
      nodePointer.style.opacity = '1';
      nodePointer.style.animation =
        "slide " +
        this.pointerAnimationTimeout / 1000 + "s " +
        "ease";
    }, this.nodeAnimationTimeout);

  }

  // private async animateNodes(from, to, nodes, pointers) {
  private async animateNodes(from, to, children) {
    for (let i = from; i <= to; i++) {
      await this.animateNode(children[i].firstChild);
      await this.animatePointer(children[i].lastChild);
    }
  }

  private animateNode(node) {
    return new Promise(resolve => {
      const animation = `highlightNode ${this.nodeAnimationTimeout / 1000}s ease`;
      this.renderer.setStyle(node, 'animation', animation);
      setTimeout(() => {
        this.renderer.setStyle(node, 'animation', null);
        resolve(true);
      }, this.nodeAnimationTimeout);
    });
  }

  private animatePointer(node) {
    return new Promise(resolve => {
      const animation = `highlightPointer ${this.pointerAnimationTimeout / 1000}s ease`;
      this.renderer.setStyle(node, 'animation', animation);
      setTimeout(() => {
        this.renderer.setStyle(node, 'animation', null);
        resolve(true);
      }, this.pointerAnimationTimeout);
    });
  }

  // private animateNodesBeforeInsert(from, to) {
  //   return new Promise(resolve => {
  //     for (let i = from; i < to; i++) {
  //       console.log('length', this.nodes.length)

  //       this.nodes[i].style.animation =
  //         "moveRightNode " +
  //         this.pointerAnimationTimeout / 1000 + "s " +
  //         "ease";

  //       this.pointers[i].style.animation =
  //         "moveRightNode " +
  //         this.pointerAnimationTimeout / 1000 + "s " +
  //         "ease";

  //       setTimeout(() => {
  //         this.nodes[i].style.animation = null;
  //         this.pointers[i].style.animation = null;
  //       }, this.pointerAnimationTimeout)
  //     }

  //     setTimeout(() => resolve(true), this.pointerAnimationTimeout)
  //   })
  // }

  public async removeNode(index: number) {
    console.log('indexx: ', index);
    // Todo
    // if (handleEmptyListError() || checkInputErrors(i, "Index", true))
    //     return;

    const children = this.nodesContainerRef.nativeElement.children;
    if (!index || index > children.length - 1) return;

    await this.animateNodes(0, index - 1, children);
    this.animateNodesAfterRemove(index + 1, children);
    // // this.deleteNode(index, nodes, pointers);
    this.deleteNode(index, children);
  }

  private animateNodesAfterRemove(from, children) {
    return new Promise(resolve => {
      for (let i = from; i < children.length; i++) {

        const animation = `moveLeftNode ${this.pointerAnimationTimeout / 1000}s ease`;
        this.renderer.setStyle(children[i].firstChild, 'animation', animation);
        this.renderer.setStyle(children[i].lastChild, 'animation', animation);

        setTimeout(() => {
          this.renderer.setStyle(children[i].firstChild, 'animation', null);
          this.renderer.setStyle(children[i].lastChild, 'animation', null);
        }, this.deleteTimeout)
      }

      setTimeout(() => resolve(true), this.deleteTimeout)
    });
  }

  // private deleteNode(i, nodes, pointers) {
  private deleteNode(i, children) {
    return new Promise(resolve => {

      const nodeAnim = `deleteNode ${this.deleteTimeout / 1000}s ease`;
      this.renderer.setStyle(children[i].firstChild, 'animation', nodeAnim);

      const pointerAnim = `deletePointer ${this.deleteTimeout / 1000}s ease`;
      this.renderer.setStyle(children[i].lastChild, 'animation', pointerAnim);

      setTimeout(() => {
        this.renderer.removeChild(this.nodesContainerRef.nativeElement, children[i]);
        resolve(true);
      }, this.deleteTimeout);
    });
  }
}
