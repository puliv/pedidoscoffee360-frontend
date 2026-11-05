import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class PedidosService {
    // Tu URL real de AWS API Gateway
    // private apiUrl = "https://oaj3mpae82.execute-api.us-east-1.amazonaws.com/test/api/pedidos";
    private apiUrl = "http://localhost:8888/api/pedidos"

    constructor(private http: HttpClient) { }

    obtenerPedidos() {
        return this.http.get<any[]>(this.apiUrl);
    }

    // NUEVO: Método POST
    crearPedido(nuevoPedido: any) {
        return this.http.post<any>(this.apiUrl, nuevoPedido);
    }

    // NUEVO: Método PUT
    actualizarPedido(id: number, nuevoEstado: string) {
        return this.http.put<any>(`${this.apiUrl}/${id}`, { estado: nuevoEstado });
    }

    // NUEVO: Método DELETE
    eliminarPedido(id: number) {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}