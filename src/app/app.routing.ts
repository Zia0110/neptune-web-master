import { Routes, RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'

import { UserIsAdminGuard } from './core/guard/user-is-admin.guard'
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component'
import { AdminLayoutComponent } from './layouts/admin-layout.component'
import { UserIsLoggedInGuard } from './core/guard/user-is-loggedin.guard'
import { UserAccessPageGuard } from './core/guard/user-access-page.guard'

const AppRoutes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [UserIsAdminGuard],
    children: [
      // { path: 'warehouse', loadChildren: () => import('./features/warehouse-components/warehouse.module').then(m => m.WarehouseComponentsModule) },
      // { path: 'order', loadChildren: () => import('./features/order-component/orders.module').then(m => m.OrderComponentsModule) },
      // { path: 'finance', loadChildren: () => import('./features/finance-component/finance.module').then(m => m.FinanceComponentsModule) },
      // { path: 'client', loadChildren: () => import('./features/client-component/client.module').then(m => m.ClientComponentsModule) },
      // { path: 'inventory', loadChildren: () => import('./features/inventory-component/inventory.module').then(m => m.InventoryComponentsModule) },
      // { path: 'product', loadChildren: () => import('./features/product-component/product.module').then(m => m.ProductComponentsModule) },
      // { path: 'management', loadChildren: () => import('./features/management-component/management.module').then(m => m.ManagementComponentsModule) },
      // { path: '', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: '', loadChildren: () => import('./features/pages/pages.module').then((m) => m.PagesComponentsModule) },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
  {
    path: '',
    loadChildren: () => import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
    canActivate: [UserIsLoggedInGuard],
  },
  { path: '**', redirectTo: 'admin' },
]

@NgModule({
  imports: [
    RouterModule.forRoot(AppRoutes, {
      enableTracing: false, // <-- debugging purposes only
      // preloadingStrategy: SelectivePreloadingStrategyService,
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutesModule {}
