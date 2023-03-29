import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  showModalConfirmation,
  showNotifyError,
  showNotifySuccess,
} from '../functions/Utilities';
import { CategoryModelo } from 'src/app/productos/models/productos.modelo';
import { ProductosService } from 'src/app/productos/services/productos.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isAuth = false;
  isAdmin = false;
  categoriesMan!: CategoryModelo[];
  categoriesWoman!: CategoryModelo[];

  constructor(
    private router: Router,
    private _auth: AuthService,
    private _ps: ProductosService
  ) {}

  ngOnInit(): void {
    this.verifiedAuth();
    this.getCategories();
  }

  public routerLink(path: string): void {
    this.router.navigate([path]);
  }

  logout() {
    showModalConfirmation(
      'Cerrar sesión',
      '¿Seguro que deseas cerrar sesión?'
    ).then((res) => {
      if (res) {
        this._auth.logout();
        this.verifiedAuth();
        showNotifySuccess('Se cerró sesión correctamente', '');
        this.router.navigate(['/home']);
      }
    });
  }

  verifiedAuth(): void {
    this.isAuth = this._auth.isAuth();
    this.isAdmin = this._auth.isAdmin();
  }

  getCategories() {
    combineLatest(
      this._ps.getCategoryPerSex('man'),
      this._ps.getCategoryPerSex('woman')
    ).subscribe(
      (res) => {
        this.categoriesMan = res[0];
        this.categoriesWoman = res[1];
      },
      (e) => {
        showNotifyError('Error al consultar', 'Intente mas tarde');
      }
    );
  }

  verCategoria(category: CategoryModelo) {
    this.router.navigate(['/home/list-categories/category', category._id.$oid]);
  }
}
