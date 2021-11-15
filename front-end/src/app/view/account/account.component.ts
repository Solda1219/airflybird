import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../function/commonFunction.service';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { UserService } from '../../service/user.service';
import { navItems } from './_nav';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  _opened = true;
  curRoute = '';
  navItem = navItems;
  item;
  role;
  constructor(
    public cf:CommonFunctionService,
    public route:Router,
    private userService: UserService,
  ) {
    this.route.events.subscribe((event: Event) => {
      this.curRoute = event['url']
      switch (true) {
        case event instanceof NavigationStart: {
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit() {
    this.curRoute=this.route.routerState.snapshot.url;
    this.role = this.userService.getToken()['role'];
  }
}