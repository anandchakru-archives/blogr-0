import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/util/blogr.model';

@Component({
  selector: 'rathnas-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Item;
  constructor() { }

  ngOnInit(): void {
  }
  parseLines(ip: string): string {
    return ip ? ip.replace(/\\n/g, '\n') : ''; // firebase doesn't allow new lines in console, might not need if data is inserted using app
  }
}
