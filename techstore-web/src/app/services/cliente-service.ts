import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClienteRequest, ClienteResponse } from '../models/cliente';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/clientes`;

  registrar(cliente: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.apiUrl, cliente);
  }

  listar(): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(this.apiUrl);
  }
}
