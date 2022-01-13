import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/user/models/response/base.model';
import { ApiService } from 'src/app/user/services/api.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserBankDetailsService {

  constructor(private apiService: ApiService) { }
  
  public _subject = new BehaviorSubject<any>('');
  
  // topbar bank details profile page refresh functionalty start
  public bank_details = new BehaviorSubject<any>('');
  bank_details_emit<T>(data: T){
    this._subject.next(data);
  }
  bank_details_on<T>(): Observable<T>{
    return this._subject.asObservable();
  }

  get_userbank_details(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/get_userbank_details";
    return this.apiService.get<ResultModel>(route, reqModel);
  } 
  delete_user_bank(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/bank_details_delete";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  update_bank_paytm_id(reqModel: any): Observable<ResultModel> {
    const route = "/api/admin/update_bank_paytm_id";
    return this.apiService.post<ResultModel>(route, reqModel);
  }
  
}