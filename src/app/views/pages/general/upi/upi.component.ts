import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { LoaderService } from 'src/app/_services/loader.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
const { API_URL } = environment;
@Component({
  selector: 'app-upi',
  templateUrl: './upi.component.html',
  styleUrls: ['./upi.component.scss']
})
export class UpiComponent implements OnInit {
  TransactionData: any;
  Result: any;
  currentDate: any
  newDate: any
  newMinDate: any
  availablebalance: any;
  @Input() onMerchantMId: EventEmitter<any> = new EventEmitter<any>();
  public monthlySalesChartOptions: any = {};
  public pieChartOptions: any = {};
  obj = {
    primary: "#6571ff",
    secondary: "#7987a1",
    // success: "#05a34a",
    success: "#0BDA51",
    info: "#66d1d1",
    // warning: "#fbbc06",
    warning: "#ff7c00",
    // danger: "#ff3366",
    danger: "#E0115F",
    light: "#e9ecef",
    dark: "#060c17",
    muted: "#7987a1",
    gridBorder: "rgba(77, 138, 240, .15)",
    bodyColor: "#000",
    cardBg: "#fff",
    fontFamily: "'Roboto', Helvetica, sans-serif"
  }
  barchart: any;
  TransactionDate: any;
  TotalRevenue: any;
  NetSettlement: any;
  piechart: any;
  Labels: any;
  merchantData: any = { 'MID': 'admin', 'date': this.datePipe.transform((new Date), 'yyyy-MM-dd') };
  user: string | null = 'admin' || localStorage.getItem('user');
  mechantData: boolean = false;
  Type: any;
  chargebackResult: any;
  refundResult: any;
  chargebackTransactionData: string[];
  refundTransactionData: string[];
  closeOthers: boolean = true;
  activeIds: string[] = [];
  chargebackholdResult: any;
  chargebackHoldData: any;
  SummaryResult: any;
  dataTable: any;
  Message: any;
  todayWithPipe: string;
  fileName: string;

  constructor(private apiservice: ApiHttpService, private loaderService: LoaderService, private datePipe: DatePipe) { }
  ngOnChanges() {
    debugger
    this.onMerchantMId.subscribe((res) => {
      this.Type = res.type
      if (res) {
        this.merchantData = res
        if (this.merchantData.MID.includes('M')) {
          this.mechantData = true
        } else {
          this.mechantData = false

        }
        this.user = 'admin' || localStorage.getItem('user')
          ;
        if (this.Type == 'search') {
          this.loaderService.showLoader();
        } this.getData(this.merchantData.MID || 'admin' || 'admin', this.merchantData.date).subscribe((res: any) => {
          debugger

          this.Result = res[0]
          this.TransactionData = Object.keys(res[0])
        })
        this.getBarData(this.merchantData.MID || 'admin', this.merchantData.date)
        this.getPieData(this.merchantData.MID || 'admin', this.merchantData.date)
          ;
        this.getDatatwo(this.merchantData.MID || 'admin', this.merchantData.date).subscribe((res: any) => {
          debugger

          this.availablebalance = res[0].Pending_Settlement
        })
        this.search(this.merchantData.MID || 'admin', this.merchantData.date)
        this.refundsearch(this.merchantData.MID || 'admin', this.merchantData.date)
        this.chargebacksearch(this.merchantData.MID || 'admin', this.merchantData.date)
        this.chargebackHold(this.merchantData.MID || 'admin', this.merchantData.date)
        this.MerchantSummary(this.merchantData.MID || 'admin', this.merchantData.date)

      }
      // this.merchatstatusform.controls['Status'].setValue(''),
      // this.loading = false,
      // this.reset(),
      // this.isForm1Submitted = false
    })
  }
  ngOnInit(): void {
    debugger
    
    var date = new Date()
    this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd')
    this.getData(this.user, this.currentDate).subscribe((res: any) => {
      debugger
      this.Result = res[0]
      this.TransactionData = Object.keys(res[0])
    })
    this.getBarData(this.user, this.currentDate)
    this.getPieData(this.user, this.currentDate)

    this.getDatatwo(this.user, this.currentDate).subscribe((res: any) => {
      debugger
      this.availablebalance = res[0].Pending_Settlement
    })
    this.activeIds = ['pan-1', 'pan-2', 'pan-3'];

   // this.MerchantSummary(this.user, this.currentDate)


  }
  getData(user: any, date: any) {
    // var date = new Date()
    // this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd')
    return this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "35",
          "Value": user + '#' + date
        }
      )
  }
  getBarData(user: any, date: any) {
    debugger
    // var date = new Date()
    // this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd')
    // if (this.Type == 'search') {
    //   this.loaderService.showLoader();
    // }
     return this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "41",
          "Value": user + '#' + date
        }
      ).subscribe((res: any) => {
        debugger
        if (this.Type == 'search') {
          this.loaderService.hideLoader();
        } this.barchart = res[0]
        this.TransactionDate = this.barchart.TransactionDate
        // this.currentDate.setDate(this.currentDate.getDate() - 365);
        // this.TransactionDate = [
        //   this.datePipe.transform(date, 'yyyy-MM-dd')
        // ]
        // this.TransactionDate = this.barchart.TransactionDate
        this.TotalRevenue = this.barchart.TotalRevenue
        this.NetSettlement = this.barchart.NetSettlement
        this.monthlySalesChartOptions = this.getMonthlySalesChartOptions(this.obj, this.TransactionDate, this.TotalRevenue, this.NetSettlement);
      })
  }
  getPieData(user: any, date: any) {
    debugger
    // var date = new Date()
    // this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd')
    // if (this.Type == 'search') {
    //   this.loaderService.showLoader();
    // }
     return this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "42",
          "Value": user + '#' + date
        }
      ).subscribe((res: any) => {
        debugger
        if (this.Type == 'search') {
          this.loaderService.hideLoader();
        } this.piechart = res[0]
        this.Labels = Object.keys(this.piechart)
        this.pieChartOptions = this.getPieChartOptions(this.obj, this.piechart, this.Labels);
      })
  }
  addRtlOptions() {

    this.monthlySalesChartOptions.yaxis.labels.offsetX = -10;
    this.monthlySalesChartOptions.yaxis.title.offsetX = -70;
  }
  getDatatwo(user: any, date: any) {
    // var date = new Date()
    // this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd')
    return this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "37",
          "Value": user + '#' + date
        }
      )

  }
  OnlyNumbersAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode > 47 && charCode < 58);

  }
  search(user: any, date: any) {
    debugger
    this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "35",
          "Value": user + '#' + date
        }
      ).subscribe((res: any) => {
        debugger
        this.Result = res[0]
        this.TransactionData = Object.keys(res[0])
        this.getBarData(user, date)
        this.getPieData(user, date)
        this.refundsearch(user,date)
        this.chargebacksearch(user,date)
        this.chargebackHold(user,date)
        this.MerchantSummary(user,date)
      })

  }

  chargebacksearch(user: any, date: any) {
    debugger
    this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "50",
          "Value": user + '#' + date
        }
      ).subscribe((res: any) => {
        debugger
        this.chargebackResult = res[0]
        this.chargebackTransactionData = Object.keys(res[0])
        this.getBarData(user, date)
        this.getPieData(user, date)
      })
  }

  refundsearch(user: any, date: any) {
    debugger
    this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "51",
          "Value": user + '#' + date
        }
      ).subscribe((res: any) => {
        debugger
        this.refundResult = res[0]
        this.refundTransactionData = Object.keys(res[0])
        this.getBarData(user, date)
        this.getPieData(user, date)
      })
  }



 chargebackHold(user: any, date: any) {
    debugger
    this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "53",
          "Value": user + '#' + date
        }
      ).subscribe((res: any) => {
        debugger
        this.chargebackholdResult = res[0]
        this.chargebackHoldData = Object.keys(res[0])
        this.getBarData(user, date)
        this.getPieData(user, date)
      })
  }


  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('dataTableExample');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    var random = Math.floor(Math.random() * 10000000000 + 1);

    var today = new Date();
    this.todayWithPipe = today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + today.getDate()).slice(-2) + "-" + random.toString().slice(-4);
    this.fileName = 'Report_' + this.todayWithPipe + '.xlsx';
    XLSX.writeFile(wb, this.fileName);

  }


  MerchantSummary(user: any, date: any) {
    debugger
    this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "54",
          "Value": user + '#' + date
        }
      ).subscribe((res: any) => {
        debugger
        this.SummaryResult = res
        if (!res  ) {
          this.Message = "No Merchant Data Found!"
          // this.alertService.errorAlert({
          //   title: "No Recharge Data Found!",
          //   // backdrop: true,
          //   toast: true,
          //   timer: 2000, position: 'top-end'
          // })
        }else{
          this.Message = ""
        }
        
        this.dataTable ? this.dataTable?.destroy() : console.log(this.SummaryResult)
        this.SummaryResult? this.dataTable = new DataTable("#dataTableExample", {
          info: false,
          ordering: false,
          paging: false,
          searchable: false,
        }) : this.dataTable.destroy()

        
        
        // this.dataTable.columns().add(data);
        if (this.SummaryResult.length>0) {
          this.SummaryResult.forEach((element: any) => {
           
            this.dataTable.rows().add(Object.values(element));
          })
        }else{
          this.dataTable.destroy()
        }

       // this.chargebackHoldData = Object.keys(res)
      
      })
  }





  getMonthlySalesChartOptions(obj: any, date: any, data1: any, data2: any) {
    debugger
    return {
      series: [
        {
          name: 'Net Settlement',
          data: data2.split(',')
        }, {
          name: 'Total Revenue',
          data: data1.split(',')
        }],

      chart: {
        type: 'bar',
        height: '318',
        parentHeightOffset: 0,
        foreColor: obj.bodyColor,
        background: obj.cardBg,
        toolbar: {
          show: false
        },
      },
      colors: [obj.primary, obj.secondary],
      fill: {
        opacity: .9
      },
      grid: {
        padding: {
          bottom: -4
        },
        borderColor: obj.gridBorder,
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: date.split(","),
        axisBorder: {
          color: obj.gridBorder,
        },
        axisTicks: {
          color: obj.gridBorder,
        },
      },
      yaxis: {
        title: {
          // text: 'Number of Sales',
          style: {
            size: 9,
            color: obj.muted
          }
        },
        labels: {
          offsetX: 0,
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: 'center',
        fontFamily: obj.fontFamily,
        itemMargin: {
          horizontal: 8,
          vertical: 0
        },
      },
      stroke: {
        width: 0
      },
      dataLabels: {
        enabled: false,
        style: {
          fontSize: '10px',
          fontFamily: obj.fontFamily,
        },
        offsetY: -27
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 4,
          dataLabels: {
            position: 'top',
            orientation: 'vertical',
          }
        },
      }
    }
  }
  getPieChartOptions(obj: any, data: any, labels: any) {
    debugger
    return {
      series: Object.values(data),
      chart: {
        height: 300,
        type: "pie",
        foreColor: obj.bodyColor,
        background: obj.cardBg,
        toolbar: {
          show: false
        },
      },
      labels: ["Success", "Pending", "Failed"],
      colors: [obj.success, obj.warning, obj.danger],
      stroke: {
        colors: ['rgba(0,0,0,0)']
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: 'center',
        fontFamily: obj.fontFamily,
        itemMargin: {
          horizontal: 8,
          vertical: 0
        },
      },
      dataLabels: {
        enabled: false
      }
    }
  };
}

