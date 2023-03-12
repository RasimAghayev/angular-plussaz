import { Component,  OnInit, NgZone } from '@angular/core';
import { PostService } from './../post.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'posts-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditPosts implements OnInit {
  PostsList: any = [];
  updatePostForm!: FormGroup;

  ngOnInit() {
    this.updateForm()
  }
  constructor(
    private actRoute: ActivatedRoute,
    public postService: PostService,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router
  ) {
    var id: string = this.actRoute.snapshot.paramMap.get('id') as string;
      console.log(this.actRoute.snapshot.paramMap.get('id'))
    this.postService.GetPost(id).subscribe((data) => {
      this.updatePostForm = this.fb.group({
        title: [data.title],
        body: [data.body]
      })
    })
  }
  updateForm(){
    console.log(this.actRoute.snapshot.paramMap.get('id'))
    this.updatePostForm = this.fb.group({
      title: [''],
      body: ['']
    })
  }
  submitForm(){
    console.log(this.actRoute.snapshot.paramMap.get('id'))
    var id: string  = this.actRoute.snapshot.paramMap.get('id') as string;
    this.postService.UpdatePost(id , this.updatePostForm.value).subscribe(res => {
      this.ngZone.run(() => this.router.navigateByUrl('/posts-list'))
    })
  }
}
