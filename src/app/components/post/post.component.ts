import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/util/blogr.model';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'rathnas-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Item;
  saving = false;
  constructor(public app: AppService) { }

  ngOnInit(): void {
  }
  parseLines(ip: string): string {
    return ip ? ip.replace(/\\n/g, '\n') : ''; // firebase doesn't allow new lines in console, might not need if data is inserted using app
  }
  trashPost(pid: string) {
    this.post.trash = true;
    this.saving = true;
    this.app.savePost(pid, this.post, () => {
      this.saving = false;
    });
  }
}
