import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from './../post.service';

@Component({
  selector: 'posts-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddPosts implements OnInit {
  postForm!: FormGroup;
  PostArr: any = [];
  ngOnInit() {
    this.addPost();
  }
  constructor(
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public postService: PostService
  ) {}
  addPost() {
    this.postForm = this.fb.group({
      title: [''],
      body: [''],
    });
  }
  submitForm() {
    this.postService.CreatePost(this.postForm.value).subscribe((res) => {
      console.log('Posts added!');
      this.ngZone.run(() => this.router.navigateByUrl('/posts-list'));
    });
  }
}
