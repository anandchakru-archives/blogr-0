import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BlogrConstants } from 'src/app/util/blogr.model';

@Component({
  selector: 'rathnas-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loaded = false;
  constructor(public app: AppService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.app.readPosts(this.route.snapshot.params.uid ? this.route.snapshot.params.uid : BlogrConstants.DEFAULT_USER, () => {
      this.loaded = true;
    });
  }

}
