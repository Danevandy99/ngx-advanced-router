import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-edit-users',
  templateUrl: './admin-edit-users.component.html',
  styleUrls: ['./admin-edit-users.component.scss']
})
export class AdminEditUsersComponent implements OnInit {

  protected adminId$ = this.route.params
    .pipe(
      map((params: Params) => {
        return params["adminId"];
      })
    )

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

}
