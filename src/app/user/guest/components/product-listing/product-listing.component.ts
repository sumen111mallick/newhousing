import { ProductListingPageService } from '../../services/product-listing-page.service';
import { CommonService } from '../../services/common.service';
import { FormBuilder} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { LabelType } from '@angular-slider/ngx-slider';
import { environment } from 'src/environments/environment';
import { Router,ActivatedRoute } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css']
})
export class ProductListingComponent implements OnInit {

  public displayStyle = "none";
  public amenties:any={};
  public area_unit:any={};
  public property:any={};
  public showLoadingIndicator:boolean= false;
  public  year:any='';
  public search_amenties:any=[];
  public rent_range_slider:boolean= true;
  public buyyer_range_slider:boolean= false;
  public range_slider:boolean= false;
  public unique_amentites:any;
  public selectedItems:any=[];
  public siteURL=environment.siteURL;
  public data:any;
  public search_type:any;
  public minimum:any;
  public maximum:any;
  public e:any;
  public p:any;
  public ftpstring=environment.ftpURL;
  public product_copm:any={};
  public product_length:number=0;
  public propertyresultlength:boolean=false;
  public category:any={};
  public dropdownList: any = []; 
  public filteredOptions!: Observable<any[]>;
  public Pagination_data: Pagination;
  public login_usertype:number = 0;
  public isLoggedIn:boolean=false;
  
  private amenityArray:any = [];
  private search_amenties_convert: any=[];

  searchForm = this.formBuilder.group({
    bathrooms: [''],
    bedrooms: [''],
    years: [''],
    area_unit: [''],
    build_name: [''],
    type: [''],
    city:[''],
    locality:[''],
    locality_data:[''],
    property_status:[''],
    search_type: ['rent'],
    sliderControl: [[]],
    max_price:[],
    min_price:[]
  });

  
  options: Options = {
    step:10000,
    floor: 5000,
    ceil: 50000000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    },
  };
  options_rent: Options = {
    step:1000,
    floor: 5000,
    ceil: 500000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    },
  };

  /* Sale feature Commented */
  options_sales: Options = {
    step:5000,
    floor: 500000,
    ceil: 50000000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    }
  }; 
  /* Sale feature Commented */

  constructor(
    private ProductListingPageService: ProductListingPageService,
    private CommonService: CommonService,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    // private mapsAPILoader: MapsAPILoader,
    // private ngZone:NgZone,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private router:Router
    ) {
      this.Pagination_data = new Pagination();
      this.param_query_check();     
     }

  ngOnInit(): void {  
    this.productcategory();
     this.getAmenities();
     this.getarea_unit();
     
    if(this.jwtService.getToken()){
     this.login_usertype = this.jwtService.getUserType();
     this.isLoggedIn=true;
    }
    this.selectedItems = new Array<string>();
  }
  // fetch amenties advance tab
  getAmenities(){
    this.CommonService.getAmenities({ param: null }).subscribe(
      response => {
        this.amenties=response;
      }
    );
  }
  getarea_unit(){
    this.CommonService.getarea_unit({ param: null }).subscribe(
      response => {
        this.area_unit=response;
      }
    );
  }
  // fetch productcategory advance tab
  productcategory(){
    this.CommonService.getproductcategory({ param: null }).subscribe(
      response => {
        //console.log(response);
        this.category=response;
      }, err => { 
      }
    );
  } 
  get_locality(value:any){
    if(value.length>2){
      this.CommonService.get_common_area_data(value).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          //console.log(this.dropdownList);
          //console.log(data);
          if(data.data[0].length>0){
            for (let i = 0; i < data.data[0].length; i++) {
              this.dropdownList = this.dropdownList?.concat({ item_id: data.data[0][i].locality_id, item_text: data.data[0][i].locality});
            }
            this.filteredOptions = this.searchForm.controls.locality.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
              }if(data.data[1].length>0){
                for (let i = 0; i < data.data[1].length; i++) {
                  this.dropdownList = this.dropdownList?.concat({ item_id: data.data[1][i].sub_locality_id, item_text: data.data[1][i].sub_locality});
                }
                this.filteredOptions = this.searchForm.controls.locality.valueChanges
                  .pipe(
                    startWith(''),
                    map((value) => this._filter(value))
                  );
              }
          if(this.dropdownList.length>0){
            this.searchForm.patchValue({locality:this.dropdownList[0].item_text});
          }else{
            this.dropdownList=[];
            this.searchForm.patchValue({locality:''});
          }
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[]; 
      this.searchForm.patchValue({locality:''});
      this.filteredOptions = this.searchForm.controls.locality.valueChanges
      .pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
    }
  }
  private _filter(value: any): string[] {
    if (value.item_text) {
      const filterValue = value.item_text.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.item_text.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.item_text.toLowerCase().includes(filterValue));
    }
  }
  
  openPopup(){
    this.displayStyle = "block";
  }  
  closePopup() {
    this.displayStyle = "none";
  }
  
  param_query_check(){
    this.route.queryParams.subscribe((params) => {
      if(params.minimum != null && params.maximum != null){
        this.searchForm.patchValue({
          // search_type:params.search_type,
          type:params.type,
          locality:params.locality,
          locality_data:params.locality,
          city:params.city,
          sliderControl:[Number(params.minimum),Number(params.maximum)]
        });
          if(params.amenties != null){  
          this.search_amenties=params.amenties;      
              if(this.search_amenties.length>0){
                this.amenityArray=[];
                for (var i = 0; i < this.search_amenties.length; i++){
                  this.search_amenties_convert.push(parseInt(this.search_amenties[i]));
                }
                this.amenityArray=this.search_amenties_convert;
              }
          }
        this.property_type_check_url();
        this.onsearch();
       }else if(params.search_type !=null){
        this.searchForm.patchValue({
          search_type:params.search_type,
          locality:params.locality,
          locality_data:params.locality,
          city:params.city,
          sliderControl:[Number(5000),Number(500000)]
        });
        this.onsearch();

       }
       else if(params.category != null){
        this.searchForm.controls['type'].setValue(params.category);         
        this.searchForm.value.sliderControl[0] = 5000;
        this.searchForm.value.sliderControl[1] = 50000000;  
        this.onsearch();
       }else if(params.cities != null){
        this.searchForm.controls['city'].setValue(params.cities); 
        this.get_locality(params.cities);        
        this.searchForm.value.sliderControl[0] = 5000;
        this.searchForm.value.sliderControl[1] = 50000000;
        this.onsearch();
       }else if(params.locality != null){
        this.searchForm.controls['locality'].setValue(params.locality);  
        this.searchForm.controls['locality_data'].setValue(params.locality);        
        this.searchForm.value.sliderControl[0] = 5000;
        this.searchForm.value.sliderControl[1] = 50000000;
        this.onsearch();
       }
       
       else{
        this.searchForm.value.sliderControl[0] = 5000;
        this.searchForm.value.sliderControl[1] = 50000000;
        this.onsearch();
       }
    });
  }
  onsearch(): void{  
    this.showLoadingIndicator =true;
    this.propertyresultlength=false;
    this.product_length=0;
    this.login_usertype = this.jwtService.getUserType();
    this.searchForm.value.min_price= this.searchForm.value.sliderControl[0];
    this.searchForm.value.max_price=this.searchForm.value.sliderControl[1]; 
    if(this.jwtService.getToken().length>5){
      if(this.login_usertype == 11){
        // let param={data:this.searchForm.value,amenities:this.amenityArray}
        this.ProductListingPageService.login_product_details(this.searchForm.value).then(
          Pagination_data => {
            this.property=Pagination_data;
            this.product_length=this.property.data.total;
            this.showLoadingIndicator = false;
          },
          err => {
            this.showLoadingIndicator = false;
          }
        );

      }else{
        // let param={data:this.searchForm.value}
        this.ProductListingPageService.login_product_details(this.searchForm.value).then(
          Pagination_data => {
            this.property=Pagination_data;
            this.product_length=this.property.data.total;
            this.showLoadingIndicator = false;
          },
          err => {
            this.showLoadingIndicator = false;
          }
        );
      }
      this.wishlist_refresh();
      this.pro_comp_refresh();
    }else{
       // let param={data:this.searchForm.value}
      this.ProductListingPageService.product_details(this.searchForm.value).then(
        Pagination_data => {
          this.property=Pagination_data;
          this.product_length=this.property.data.total;
          this.showLoadingIndicator = false;
        },
        err => {
          this.showLoadingIndicator = false;
        }
      );
    }
    this.closePopup();
  } 
  
  gotoPage(link_url: any) {
    this.searchForm.value.min_price= this.searchForm.value.sliderControl[0];
    this.searchForm.value.max_price=this.searchForm.value.sliderControl[1]; 
    this.showLoadingIndicator = true;
    this.ProductListingPageService.post_pagination(link_url,this.searchForm.value).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.property=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  } 
  selected_locality(data:any){
    this.searchForm.controls['locality'].setValue(data);  
  }   
  navigate(): void{
    //console.log(this.searchForm.value);
    if(this.searchForm.value.locality.length<3){
      this.searchForm.patchValue({locality:''});
    }
    let data:any=this.searchForm.value;
    this.product_length=0;
    if(this.jwtService.getToken()){
      this.login_usertype = this.jwtService.getUserType();
       if(this.login_usertype == 11){
        this.router.navigate(['/product-listing'],{queryParams:{'name':data.build_name,'city':data.city,'type':data.type,'locality':data.locality,'search_type':data.search_type,'area_unit':data.area_unit,'years':data.years,'bedrooms':data.bedrooms,'bathrooms':data.bathrooms,'minimum':data.sliderControl[0],'maximum':data.sliderControl[1]}});
        // this.router.navigate(['/product-listing'],{queryParams:{'name':data.build_name,'city':data.city,'type':data.type,'locality':data.locality,'search_type':data.search_type,'area_unit':data.area_unit,'years':data.years,'bedrooms':data.bedrooms,'bathrooms':data.bathrooms,'minimum':data.sliderControl[0],'maximum':data.sliderControl[1],amenties:this.amenityArray}});
       }else{
        this.router.navigate(['/product-listing'],{queryParams:{'city':data.city,'locality':data.locality,'type':data.type,'minimum':data.sliderControl[0],'maximum':data.sliderControl[1]}});
       }
     }else{
      this.router.navigate(['/product-listing'],{queryParams:{'city':data.city,'locality':data.locality,'type':data.type,'minimum':data.sliderControl[0],'maximum':data.sliderControl[1]}});
     }
    } 
  onchangeAmenties(e:any,id:any){
    if(e.target.checked){
      this.search_amenties_convert.push(id);
      const expected = new Set();
      const unique = this.search_amenties_convert.filter((item: any) => !expected.has(JSON.stringify(item)) ? expected.add(JSON.stringify(item)) : true);
      this.unique_amentites=unique;
      this.amenityArray=this.unique_amentites;
    }else{
      const index: number = this.search_amenties_convert.indexOf(id);
      if (index !== -1) {
        this.search_amenties_convert.splice(index, 1);
        this.amenityArray=this.search_amenties_convert;
      }
    }
  }  
  property_status(){
    this.onsearch();
  }
  property_type():void{
    if(this.searchForm.value.search_type=='rent'){ 
      this.searchForm.value.sliderControl[0] = 5000;
      this.searchForm.value.sliderControl[1] = 500000;
      this.searchForm.controls['search_type'].setValue('rent');
      this.rent_range_slider=true;
      this.buyyer_range_slider=false;
      this.range_slider=false;
    }
    if(this.searchForm.value.search_type=='sales'){ 
      this.searchForm.value.sliderControl[0] = 500000;
      this.searchForm.value.sliderControl[1] = 50000000;
      this.searchForm.controls['search_type'].setValue('sales');
      this.rent_range_slider=false;
      this.buyyer_range_slider=true;
      this.range_slider=false;
    }
    if(this.searchForm.value.search_type=='all'){ 
      this.searchForm.value.sliderControl[0] = 5000;
      this.searchForm.value.sliderControl[1] = 50000000; 
      this.rent_range_slider=false;
      this.buyyer_range_slider=false;
      this.range_slider=true;
    }   
  }  
  property_type_check_url():void{
    if(this.search_type == 'rent'){ 
      this.rent_range_slider=true;
      this.buyyer_range_slider=false;
      this.range_slider=false;
    }
    if(this.search_type == 'sales'){ 
      this.rent_range_slider=false;
      this.buyyer_range_slider=true;
      this.range_slider=false;
    }  
    if(this.search_type=='all'){ 
      this.rent_range_slider=false;
      this.buyyer_range_slider=false;
      this.range_slider=true;
    } 
  }
  reset_Search():void{
    this.searchForm.setValue({
      bathrooms: '',
      bedrooms: '',
      years: '',
      area_unit:'',
      search_type: 'rent',
      build_name: '',
      type: '',
      // location: '',
      city:'',
      locality:'',
      locality_data:'',
      property_status:'',
      sliderControl: [5000,50000000],
      min_price:Number(5000),
      max_price:Number(50000000) 
    });    
    this.search_amenties=[];
    this.amenityArray=[];
    this.product_length=0;
    this.router.navigate(['/product-listing']);
    // this.property_type();
    this.onsearch();
  }
  
  
  // property compare
  product_comp(id:number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.product_comp({param}).subscribe(
      response => {
        this.product_copm=response;
        this.product_length=0;
        this.onsearch();
        if(this.product_copm.data.length>4){
          this.toastr.info('Compare are the Full...!!!', 'Property', {
            timeOut: 3000,
          });
        }else{
          this.toastr.success('Added To compare Successfully', 'Property', {
            timeOut: 3000,
          });
        }
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  // wishlist add 
  wishlist_added(id: number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.wishlist_addd({param}).subscribe(
      response => {
        this.product_length=0;
        this.onsearch();
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
      }
     );
    }
    else{
      this.redirect_to_login();
    }
  }
  // wishlist delete
  wishlist_remove(id: number){
    let param={id:id}
    if(this.jwtService.getToken()){
      this.CommonService.wishlist_remove({param}).subscribe(
      response => {
        this.product_length=0;
        this.onsearch();
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
      }
     );
    }else{
      this.redirect_to_login();
    }
  }
  
   // pricre convert functionalty
   Price_convert(num: number) {
    if (num >= 1000000000) {
       return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + 'G';
    }
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2).replace(/\.0$/, '') + 'Crore';
    }
    if (num >= 100000) {
      return (num / 100000).toFixed(2).replace(/\.0$/, '') + 'Lac';
    }
    if (num >= 1000) {
      this.e=num;
      var t = (this.e = this.e ? this.e.toString() : "").substring(this.e.length - 3)
      , n = this.e.substring(0, this.e.length - 3);
    return "" !== n && (t = "," + t),
      n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
    }
    return num;
  }
  
  sub_navigate(id:number,name:string,city:string){
    this.product_length=0;
    this.router.navigate(['/product-details'],{queryParams:{'id':id,'name':name,'city':city}})
  }
  
  redirect_to_login(): void {
    this.router.navigate(['/login'])
  }
  
  // wishlist refreh functionalty 
  wishlist_refresh(){
    this.CommonService.emit<string>('true');
  } 
  // product comapre refresh function 
  pro_comp_refresh(){
    this.CommonService.pro_comp_emit<string>('true');
  } 
  // carosule image
  customOptions: OwlOptions = {
   loop: true,
   mouseDrag: false,
   touchDrag: false,
   pullDrag: false,
   dots: false,
   navSpeed: 700,
   navText: ['<span class="outer_slider"><i class="flaticon-left-arrow-1 left"></i></span> ', '<span class="outer_slider"><i class="flaticon-right-arrow right"></i></span>'],
   responsive: {
     0: {
       items: 1
     },
     400: {
       items: 1
     },
     740: {
       items: 1
     },
     940: {
       items: 1
     },
     1050: {
       items: 1
     }
   },
   nav: true
 }
 displayFn(value?: any) {
   return value ? this.dropdownList.find((option: any) => option.item_id === value.item_id).item_text : undefined;
 }
}
