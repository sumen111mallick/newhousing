import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../services/jwt.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../guest/services/common.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-guest-header',
  templateUrl: './guest-header.component.html',
  styleUrls: ['./guest-header.component.css']
})
export class GuestHeaderComponent implements OnInit {

  public LoggedIn: boolean = false;
  public userEmail: string = '';
  public userId: string = '';
  public profile_pic: string = '';
  public google_profile_pic: any;
  public userName: string = '';
  private logged_in: Subscription;
  public ftpstring = environment.ftpURL;


  constructor(
    private jwtService: JwtService,
    private commonService: CommonService,
    private sanitizer:DomSanitizer 
  ) { 
    this.logged_in = this.commonService.getUpdate().subscribe(
      message => {
        //console.log(message);
        this.LoggedIn = message.text;
        this.userName = message.name;
        this.profile_pic = message.profile_pic;
        if(this.profile_pic?.indexOf('https') != -1) {
          this.google_profile_pic = this.sanitize(this.profile_pic)
        }
        //console.log(this.profile_pic);
      });
  }

  ngOnInit(): void {
    //console.log(this.LoggedIn);
    if(this.jwtService.isTokenAvailable()) {
      //console.log("Token Available");
      this.LoggedIn = true;
      this.userEmail = this.jwtService.getUserEmail();
      //console.log(this.userEmail);
      this.userId = this.jwtService.getUserId();
      //this.profile_pic = JSON.parse(this.jwtService.getProfilePic());
      this.profile_pic = this.jwtService.getProfilePic();
      if(this.profile_pic.indexOf('https') != -1) {
        this.google_profile_pic = this.sanitize(this.profile_pic)
        //console.log(this.google_profile_pic);
      }
      else {
        this.profile_pic = JSON.parse(this.profile_pic);
      }
      this.userName = this.jwtService.getUserName();
      //console.log(this.profile_pic);
    }
    else {
      this.LoggedIn = false;
    }
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

}
