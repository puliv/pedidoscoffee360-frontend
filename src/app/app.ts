import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { signInWithRedirect, signOut, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { PedidosService } from './pedidos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  usuario = '';
  autenticado = false;
  pedidos: any[] = [];
  cargandoPedidos = false;
  errorPedidos = '';
  nuevoProducto = '';

  constructor(private pedidosService: PedidosService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.verSesion(); // Revisa si ya estabas logueado al recargar la página

    // Escucha silenciosamente a AWS. Si te logueas, cambia de "página" automáticamente
    Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signInWithRedirect' || payload.event === 'signedIn') {
        this.verSesion();
      }
    });
  }

  async login() {
    await signInWithRedirect();
  }

  async logout() {
    await signOut();
    this.autenticado = false;
    this.pedidos = [];
    this.usuario = '';
    this.cdr.detectChanges(); // Actualiza la pantalla al instante
  }

  async verSesion() {
    try {
      const user = await getCurrentUser();
      this.usuario = user.username;
      this.autenticado = true;
      // NOTA: Aquí NO consultamos los pedidos automáticamente por petición tuya.
      this.cdr.detectChanges(); 
    } catch (error) {
      this.autenticado = false;
      this.cdr.detectChanges();
    }
  }

  consultarPedidos() {
    this.cargandoPedidos = true;
    this.errorPedidos = '';
    this.cdr.detectChanges();

    this.pedidosService.obtenerPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargandoPedidos = false;
        this.cdr.detectChanges(); // Dibuja los pedidos al instante
      },
      error: (error) => {
        console.error(error);
        this.errorPedidos = `Error HTTP ${error.status}`;
        this.cargandoPedidos = false;
        this.cdr.detectChanges();
      }
    });
  }

  crearPedido() {
    if (!this.nuevoProducto) return; 
    this.cargandoPedidos = true;
    this.cdr.detectChanges();
    
    const nuevo = {
      id: Math.floor(Math.random() * 1000) + 10, 
      producto: this.nuevoProducto,
      estado: 'PREPARANDO'
    };
    
    this.pedidosService.crearPedido(nuevo).subscribe({
      next: () => {
        this.nuevoProducto = ''; 
        this.consultarPedidos(); 
      },
      error: (error) => {
        console.error("Error al crear:", error);
        this.cargandoPedidos = false;
        this.cdr.detectChanges();
      }
    });
  }

  actualizarPedido(id: number, estadoActual: string) {
    this.cargandoPedidos = true;
    this.cdr.detectChanges();
    const nuevoEstado = estadoActual === 'PREPARANDO' ? 'LISTO_PARA_RETIRO' : 'ENTREGADO';
    
    this.pedidosService.actualizarPedido(id, nuevoEstado).subscribe({
      next: () => this.consultarPedidos(),
      error: (error) => {
        this.cargandoPedidos = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarPedido(id: number) {
    this.cargandoPedidos = true;
    this.cdr.detectChanges();
    this.pedidosService.eliminarPedido(id).subscribe({
      next: () => this.consultarPedidos(),
      error: (error) => {
        this.cargandoPedidos = false;
        this.cdr.detectChanges();
      }
    });
  }
}