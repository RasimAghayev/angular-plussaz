import { Component, OnInit } from '@angular/core';
import { PostService } from './../post.service';

@Component({
  selector: 'posts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListPosts  implements OnInit {
  PostsList: any = [];

  ngOnInit() {
    this.loadPosts();
  }
  constructor(
    public postService: PostService
  ){ }
   // Issues list
   loadPosts() {
    return this.postService.GetPosts().subscribe((data: {}) => {
      this.PostsList = data;
    })
  }
    // Delete issue
    deleteIusse(data: { title: any; id: any; }){
      var index = this.PostsList.map((x: { title: any; }) => {return x.title}).indexOf(data.title);
       return this.postService.DeletePost(data.id).subscribe(res => {
        this.PostsList.splice(index, 1)
         console.log('Post deleted!')
       })
    }
}
