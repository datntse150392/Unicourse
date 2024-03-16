import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../demo/service/auth.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.development';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
    items!: MenuItem[];

    items1!: MenuItem[];

    isLogin: boolean = false;

    public LOGO: string = environment.LOGO;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.isLogin =
            localStorage.getItem('isLogin') === 'true' ? true : false;
        this.items = [
            {
                label: 'Đăng nhập',
                icon: 'pi pi-fw pi-sign-in',
            },
        ];

        this.items1 = [
            {
                label: 'Đăng xuất',
                icon: 'pi pi-fw pi-sign-out',
            },
        ];
    }

    logout() {
        if (this.isLogin) {
            this.authService.doLogout();
            // Đăng xuất thì xóa hết dữ liệu trong localStorage
            localStorage.clear();
            this.isLogin = false;
            window.location.reload();
            this.router.navigate(['/auth/login']);
        }
    }

    login() {
        if (!this.isLogin) {
            this.router.navigate(['/auth/login']);
        }
    }
}
