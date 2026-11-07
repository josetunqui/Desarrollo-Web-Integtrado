import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-selector-cantidad',
  templateUrl: './selector-cantidad.html',
  styleUrl: './selector-cantidad.scss',
})
export class SelectorCantidad {
  // Doble sentido: el padre envía y recibe la cantidad con model()
  cantidad = model(1);
  max = input(10);

  sumar(): void {
    if (this.cantidad() < this.max()) {
      this.cantidad.update((c) => c + 1);
    }
  }

  restar(): void {
    if (this.cantidad() > 1) {
      this.cantidad.update((c) => c - 1);
    }
  }
}
