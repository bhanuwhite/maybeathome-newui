import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/base-module/base-module.module').then(m => m.BaseModuleModule)
   
  },
  {
    path: 'agency',
    loadChildren: () => import('src/app/agency/agency.module').then(m => m.AgencyModule)
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    scrollPositionRestoration: 'enabled',
    paramsInheritanceStrategy: 'always',
    anchorScrolling: 'enabled',
  })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}

