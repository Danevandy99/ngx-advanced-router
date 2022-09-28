import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss']
})
export class AdminEditComponent {

  protected adminId$ = this.route.params
    .pipe(
      map((params: Params) => {
        return params["adminId"];
      })
    )

  constructor(
    private route: ActivatedRoute
  ) { }

}
