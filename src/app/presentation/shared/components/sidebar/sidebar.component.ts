import { Component, computed, effect, ElementRef, HostListener, inject, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../interfaces/menu.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebar', { static: true }) sidebar!: ElementRef;

  private menuService = inject(MenuService);
  
  // Computed properties para reactive updates
  isCollapsed = this.menuService.isCollapsed;
  openSubmenu = this.menuService.openSubmenu;
  menuItems = computed(() => this.menuService.getMenuItems());
  
  // Signals para manejo móvil
  private _showMobileSidebar = signal(false);
  private _isMobile = signal(false);
  
  showMobileSidebar = this._showMobileSidebar.asReadonly();
  isMobile = this._isMobile.asReadonly();

  constructor() {
    // Effect para manejar cambios en el sidebar
    effect(() => {
      if (this.isCollapsed()) {
        document.body.classList.add('sidebar-collapsed');
      } else {
        document.body.classList.remove('sidebar-collapsed');
      }
    });

    // Effect para manejar el overlay del sidebar móvil
    effect(() => {
      if (this._showMobileSidebar()) {
        document.body.classList.add('sidebar-mobile-open');
      } else {
        document.body.classList.remove('sidebar-mobile-open');
      }
    });
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this._isMobile() && this._showMobileSidebar()) {
      const target = event.target as HTMLElement;
      const isToggleButton = target.closest('.mobile-toggle');
      const isSidebar = target.closest('.sidebar');
      
      if (!isToggleButton && !isSidebar) {
        this.hideMobileSidebar();
      }
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this._isMobile() && this._showMobileSidebar()) {
      this.hideMobileSidebar();
    }
  }

  private checkScreenSize(): void {
    const isMobile = window.innerWidth <= 768;
    this._isMobile.set(isMobile);
    
    if (!isMobile) {
      this._showMobileSidebar.set(false);
    }
  }

  toggleSidebar(): void {
    console.log('Toggle sidebar called, isMobile:', this._isMobile());
    
    if (this._isMobile()) {
      const newState = !this._showMobileSidebar();
      this._showMobileSidebar.set(newState);
      console.log('Mobile sidebar state:', newState);
    } else {
      this.menuService.toggleSidebar();
    }
  }

  hideMobileSidebar(): void {
    if (this._isMobile()) {
      this._showMobileSidebar.set(false);
      console.log('Mobile sidebar hidden');
    }
  }

  toggleSubmenu(menuId: string): void {
    this.menuService.toggleSubmenu(menuId);
  }

  isSubmenuOpen(menuId: string): boolean {
    return this.menuService.isSubmenuOpen(menuId);
  }

  onMenuItemClick(): void {
    if (this._isMobile()) {
      this.hideMobileSidebar();
    }
  }

  getSidebarClasses(): string {
    let classes = 'sidebar';
    
    if (!this._isMobile() && this.isCollapsed()) {
      classes += ' collapsed';
    }
    
    if (this._isMobile() && this._showMobileSidebar()) {
      classes += ' show-mobile';
    }
    
    return classes;
  }
}