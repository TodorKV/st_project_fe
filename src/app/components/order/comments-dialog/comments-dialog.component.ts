import { Component, OnInit } from '@angular/core';
import { Jwtobj } from 'src/app/common/jwtobj';
import { Tenant } from 'src/app/common/order';
import { CommentsService, Comment } from 'src/app/services/comments.service';
import { TenantService } from 'src/app/services/tenant.service';
import { ActionstatusesService } from '../actionstatuses.service';
import jwt_decode from 'jwt-decode';
import { Jwtutils } from 'src/app/common/jwtutils';
import { Router } from '@angular/router';
@Component({
  selector: 'app-comments-dialog',
  templateUrl: './comments-dialog.component.html',
  styleUrls: ['./comments-dialog.component.css']
})
export class CommentsDialogComponent implements OnInit {

  comments!: Comment[];
  postComment: string = '';
  userEmail: string = '';
  constructor(private commentService: CommentsService,
    private tenantService: TenantService,
    private actionStatusService: ActionstatusesService,
    private router: Router) { }

  ngOnInit(): void {
    this.comments = this.actionStatusService.currentActionStatus.comments!;
    try {
      let token = localStorage.getItem("token");
      let decoded: Jwtobj = (jwt_decode(token!));
      if (token == null || token == "" || Jwtutils.tokenExpired(decoded.exp!)) {
        localStorage.setItem("token", "");
        this.router.navigate(["login"]).then(value => window.location.reload())
      }
      this.userEmail = decoded.sub;
      console.log(this.userEmail);
    }
    catch (Error) {
      console.log(Error)

    }
  }

  saveComment() {
    let tenant = new Tenant;
    tenant.id = this.tenantService.getCurrentTenant() + '_id';

    this.commentService.saveComment(this.postComment, tenant, this.actionStatusService.currentActionStatus, '').subscribe(
      data => {
        this.comments.unshift(new Comment(data.comment!, data.tenant, data.actionStatus, data.timeSent!));
      }
    )

    this.postComment = "";
  }

}