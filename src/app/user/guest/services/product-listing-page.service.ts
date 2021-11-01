import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/response/base.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductListingPageService {

  constructor(
    private apiService: ApiService
    ) { }
    
  getProperty_listing(reqModel:any): Observable<ResultModel> {
    const route = "/api/product/product_list_featured";
    return this.apiService.get<ResultModel>(route, reqModel);
  }
}
