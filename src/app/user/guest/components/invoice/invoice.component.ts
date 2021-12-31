import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlansPageService } from '../../services/plans-page.service';
import { InvoicePageService } from '../../services/invoice-page.service';
import { ProductPageService } from '../../services/product-page.service';
import { ToWords } from 'to-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const toWords = new ToWords();

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  @ViewChild('htmlData') htmlData!:ElementRef;

  public showLoadingIndicator: boolean = false;

  public invoice_id: any;
  private response: any;
  public inv_response: any;
  public sgst_amount: any;
  public cgst_amount: any;
  private order_details: any;
  public total_amount: any;
  public ord_details: any;
  public invoice_data: any;
  public address: any;
  public product_data: any;
  public total_amount_owner: any;
  public amount_words: any;
  public user_name: any;
  public address1: any;
  public address2: any;
  public address3: any;
  public address4: any;

  constructor(
    private route: ActivatedRoute,
    private plansPageService: PlansPageService,
    private router: Router,
    private invoicePageService: InvoicePageService,
    private productService: ProductPageService) { 
    }

  ngOnInit(): void {

    this.showLoadingIndicator = true;
    this.invoice_id = this.route.snapshot.queryParams['invoice_no'];

    this.invoicePageService.getInvoiceData().subscribe(
      data => {
        console.log(data);
        this.invoice_data = data;
        this.address = this.invoice_data.address.split(",");
        this.address1 = this.address[0];
        this.address2 = this.address[1];
        this.address3 = this.address[2];
        this.address4 = this.address[3];
        console.log(this.address);
        this.showLoadingIndicator = false;
      },
      err => {
        this.showLoadingIndicator = false;
        console.log(err);
      }
    );
    this.showLoadingIndicator = true;
    this.plansPageService.getInvoiceDetails(this.invoice_id).subscribe(
      res => {
        console.log(res);
        this.response = res;
        this.inv_response = this.response[0];
        this.invoicePageService.getUserName(this.inv_response?.user_email).subscribe(
          u_data => {
            console.log(u_data);
            this.user_name = u_data;
            this.user_name = this.user_name.data;
          },
          u_err => {
            console.log(u_err);
          }
        );
        this.sgst_amount = Math.round((this.invoice_data?.sgst * this.response[0].plan_price) / 100);
        this.cgst_amount = Math.round((this.invoice_data?.cgst * this.response[0].plan_price) / 100);

        if (this.inv_response.plan_type == 'rent') {
          this.plansPageService.getRentOrderDetails(this.inv_response.order_id).subscribe(
            res => {
              this.order_details = res;
              this.ord_details = this.order_details[0];
              console.log(this.order_details);

              this.productService.get_product_details(this.ord_details?.property_id).subscribe(
                data => {
                  console.log(data);
                  this.product_data = data;
                  this.product_data = this.product_data[0];
                },
                err => {
                  console.log(err); 
                }
              );

              if (this.ord_details.maintenance_charge) {
                this.total_amount_owner = this.ord_details.expected_rent + this.ord_details.security_deposit + this.ord_details.maintenance_charge;
                this.total_amount = this.inv_response.plan_price + this.sgst_amount + this.cgst_amount + this.ord_details.expected_rent + this.ord_details.security_deposit + this.ord_details.maintenance_charge;
                this.amount_words = toWords.convert(this.total_amount);
              }
              else {
                this.total_amount_owner = this.ord_details.expected_rent + this.ord_details.security_deposit;
                this.total_amount = this.inv_response.plan_price + this.sgst_amount + this.cgst_amount + this.ord_details.expected_rent + this.ord_details.security_deposit;
                this.amount_words = toWords.convert(this.total_amount);
              }
            },
            err => {
              console.log(err);
            }
          );
        }
        else if (this.inv_response.plan_type == 'let_out') {
          this.total_amount = this.inv_response.plan_price + this.sgst_amount + this.cgst_amount;
          this.amount_words = toWords.convert(this.total_amount);
        }
        this.showLoadingIndicator = false;
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );

  }

  generatePDF() {
    // let DATA = this.htmlData?.nativeElement;
    const data = document.getElementById('htmlData')!;
    html2canvas(data).then(canvas => {

      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

      PDF.save('invoice.pdf');
    });
  }

  navigate_plans() {
    this.router.navigate(['my-plans'])
  }

}
