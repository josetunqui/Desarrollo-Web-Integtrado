import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto, ProductoNuevo } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/productos`;

  listar(texto = ''): Observable<Producto[]> {
    let params = new HttpParams();
    if (texto.trim()) {
      params = params.set('q', texto.trim()); // GET /productos?q=texto
    }
    return this.http.get<Producto[]>(this.url, { params });
  }

  obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  crear(producto: ProductoNuevo): Observable<Producto> {
    return this.http.post<Producto>(this.url, producto);
  }

  actualizar(id: number, producto: ProductoNuevo): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, producto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
