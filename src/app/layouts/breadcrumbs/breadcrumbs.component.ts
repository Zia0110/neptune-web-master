import { Component, OnInit } from '@angular/core';
import { MenuItems } from '../menu-items';
import { UserState } from '../../core/user/user.state';
import { AppConfigStore } from '../../core/services/app-config.store';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: 'breadcrumbs.component.html'
  })


export class BreadcrumbsComponent implements OnInit{
  pageName:string;

    constructor(
      public appConfigStore: AppConfigStore,
      private userState: UserState,
      public menuItems: MenuItems
    ) {
    }

    ngOnInit() {
      // Get user route state from User States
      this.breadCrumbs();
    }

    breadCrumbs(){
      const menu = this.menuItems.getMenuitem()

      // const menu = this.appConfigStore.appSettings['Sidebar'].PageGroup

      // console.log(menu)

      this.userState.currentRouteURL.subscribe(
        (res) => {

          let url = res['url'];
          for (let i of menu){
            if (i.Children){
              for (let j of i.Children){
                if (j.Url == url){
                  return this.pageName = i.GroupName + ' / ' + j.PageName;
                }
              }
            }else if (i.Url == url){
              return this.pageName = i.GroupName;
            }
          }
        }
      )
    }
  

}