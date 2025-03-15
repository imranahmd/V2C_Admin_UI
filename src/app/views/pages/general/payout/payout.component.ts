import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { environment } from 'src/environments/environment';
import { DataTable } from "simple-datatables";
import * as XLSX from 'xlsx';
import { AlertService } from 'src/app/_services/alert.service';
import { LoaderService } from 'src/app/_services/loader.service';
const { API_URL } = environment;
@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss']
})
export class PayoutComponent implements OnInit {
  public areaChartOptions: any = {};

  TransactionData: any;
  TransactionDate: any;
  Result: any;
  currentDate: any
  newDate: any
  newMinDate: any
  availablebalance: any;
  dataTable: DataTable;
  rowData: any = [];
  todayWithPipe: string;
  fileName: string;
  @Input() onMerchantMId1: EventEmitter<any> = new EventEmitter<any>();

  public monthlySalesChartOptions: any = {};
  response: any = {

    "fromDate": "20 May 2023",

    "toDate": "03 Jun 2023",

    todatalDays: "15",

    values: [
      [
        4, 3, 10, 9, 29, 19, 25, 9, 12, 7, 19, 5, 13, 9, 17, 2
      ], [
        2, 3, 8, 7, 22, 16, 23, 7, 11, 5, 12, 5, 10, 4, 15, 2
      ],
      [
        4, 3, 10, 9, 29, 19, 25, 9, 12, 7, 19, 5, 13, 9, 17, 2
      ], [
        2, 3, 8, 7, 22, 16, 23, 7, 11, 5, 12, 5, 10, 4, 15, 2
      ]
    ],
    name: [
      'Success ', ' Failed', 'Pending', 'Completed']
  }

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
  TotalPending: any;
  TotalSuccess: any;
  TotalFailed: any;
  merchantData: any;
  user: any = 'admin' || localStorage.getItem('user');
  mechantData: boolean = false;
  reportData: any;
  count: number = 0;
  Type: any;
  Message: string='';

  constructor(private apiservice: ApiHttpService, private loaderService: LoaderService, private datePipe: DatePipe, private alertService: AlertService) { }
  ngOnChanges() {
    debugger
    this.count = 0
    this.onMerchantMId1.subscribe((res) => {
      this.Type = res.type
      if (res) {
        this.merchantData = res
        if (this.merchantData.MID.includes('M')) {
          this.mechantData = true
        } else {
          this.mechantData = false
        }
        if (this.Type == 'search') {
          this.loaderService.showLoader();
        }
        this.getData(this.merchantData.MID || 'admin', this.merchantData.date).subscribe((res: any) => {
          debugger
          this.Result = res[0]
          this.TransactionData = Object.keys(res[0])
        })
        this.getBarData(this.merchantData.MID || 'admin', this.merchantData.date)
        // this.getPieData(this.merchantData.MID||'admin',this.merchantData.date)

        this.getDatatwo(this.merchantData.MID || 'admin', this.merchantData.date).subscribe((res: any) => {
          debugger
          this.availablebalance = res[0].AvailableBalance
        })
        this.search(this.merchantData.MID || 'admin', this.merchantData.date)
      }
      this.count = 0
      this.getReport(this.merchantData.MID || 'admin', this.merchantData.date)
      // this.merchatstatusform.controls['Status'].setValue(''),
      // this.loading = false,
      // this.reset(),
      // this.isForm1Submitted = false
    })
  }
  ngOnInit(): void {
    debugger
    ;
    this.count = 0
    // this.areaChartOptions = this.getAreaChartOptions(this.obj);
    var date = new Date()
    this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd')
      ;
    this.getData(this.user, this.currentDate).subscribe((res: any) => {
      debugger

      this.Result = res[0]
      this.TransactionData = Object.keys(res[0])
    })
      ;
    this.getDatatwo(this.user, this.currentDate).subscribe((res: any) => {

      this.availablebalance = res[0].AvailableBalance
    })
    this.getBarData(this.user, this.currentDate)

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
  getReport(user: any, date: any) {
    return this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "45",
          "Value": user + '#' + date
        }
      ).subscribe((res: any) => {
        debugger
        this.count++;
        if (!res  ) {
          this.Message = "No Recharge Data Found!"
          // this.alertService.errorAlert({
          //   title: "No Recharge Data Found!",
          //   // backdrop: true,
          //   toast: true,
          //   timer: 2000, position: 'top-end'
          // })
        }else{
          this.Message = ""
        }
        this.reportData = res
        this.rowData = res
        // this.dataTable ? this.dataTable.destroy() : console.log(this.rowData)
        this.rowData ? this.dataTable = new DataTable("#dataTableExample", {
          info: false,
          ordering: false,
          paging: false,
          searchable: false,
        }) : this.dataTable.destroy()

        // this.dataTable.columns().add(data);
        if (this.rowData) {debugger
          this.rowData.forEach((element: any) => {
            var x :any=Object.values(element)
            this.dataTable.rows().add(x);
          })
        }

      })
  }
  getData(user: any, date: any) {
    // var date=new Date()
    // this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd')
    return this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "36",
          "Value": user + '#' + date
        }
      )
  }
  getDatatwo(user: any, date: any) {
    // var date=new Date()
    // this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd')
    return this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "38",
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
    // if (this.Type == 'search') {
    //   this.loaderService.showLoader();
    // }
     this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "36",
          "Value": user + '#' + date
        }
      ).subscribe((res: any) => {
        debugger
        if (this.Type == 'search') {
          this.loaderService.hideLoader();
        } this.Result = res[0]
        this.TransactionData = Object.keys(res[0])
        this.getBarData(user, date)
        this.count = 0
        this.getReport(user, date)

      })

  }
  getBarData(user: any, date: any) {
    // var date = new Date()
    // this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd')
    // if (this.Type == 'search') {
    //   this.loaderService.showLoader();
    // }

    return this.apiservice
      .post(
        `${API_URL}/GetDropdown`,
        {
          "Type": "43",
          "Value": user + '#' + date
        }
      ).subscribe((res: any) => {
        debugger
        if (this.Type == 'search') {
          this.loaderService.hideLoader();
        }

        this.barchart = res[0]
        this.TransactionDate = this.barchart.TransactionDate
        this.TotalSuccess = this.barchart.TotalSuccess
        this.TotalPending = this.barchart.TotalPending
        this.TotalFailed = this.barchart.TotalFailed
        this.monthlySalesChartOptions = this.getMonthlySalesChartOptions(this.obj, this.TransactionDate, this.TotalSuccess, this.TotalPending, this.TotalFailed);
      })
  }
  getMonthlySalesChartOptions(obj: any, date: any, data1: any, data2: any, data3: any) {
    debugger
    return {
      series: [{
        name: 'Total Success',
        data: data1.split(',')
      },
      {
        name: 'Total Pending',
        data: data2.split(',')
      },
      {
        name: 'Total Failed',
        data: data2.split(',')
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
      colors: [obj.success, obj.warning, obj.danger],
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
  generateDayWiseTimeSeries(s: number, count: number) {
    var values = [[
      4, 3, 10, 9, 29, 19, 25, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5
    ], [
      2, 3, 8, 7, 22, 16, 23, 7, 11, 5, 12, 5, 10, 4, 15, 2, 6, 2
    ],
    [
      2, 3, 8, 7, 22, 16, 23, 7, 11, 5, 12, 5, 10, 4, 15, 2, 6, 2
    ],
    [
      2, 3, 8, 7, 22, 16, 23, 7, 11, 5, 12, 5, 10, 4, 15, 2, 6, 2
    ],

    ];
    var i = 0;
    var series: any[] = [];
    var x = new Date("15 May 2023").getTime();
    while (i < count) {
      series.push([x, values[s][i]]);
      x += 86400000;
      i++;
      console.log(x, "::::::", s, "::::", i, ":::::::::::" + values[s][i])
    }
    console.log(series)
    return series;
  }


  getAreaChartOptions(obj: any) {
    return {
      series: [
        {
          name: 'Total Transaction',
          data: this.generateDayWiseTimeSeries(0, 18)
        },
        {
          name: 'Success',
          data: this.generateDayWiseTimeSeries(3, 18)
        },
        {
          name: 'Pending',
          data: this.generateDayWiseTimeSeries(2, 18)
        },
        {
          name: 'Failed',
          data: this.generateDayWiseTimeSeries(1, 18)
        }


      ],
      chart: {
        type: "area",
        height: 300,
        parentHeightOffset: 0,
        foreColor: obj.bodyColor,
        background: obj.cardBg,
        toolbar: {
          show: false
        },
        stacked: true,
      },
      colors: [obj.primary, obj.info, obj.warning, obj.danger],
      stroke: {
        curve: "smooth",
        width: 3
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: "datetime",
        axisBorder: {
          color: obj.gridBorder,
        },
        axisTicks: {
          color: obj.gridBorder,
        },
      },
      yaxis: {
        title: {
          text: 'Transaction Count',
        },
        tickAmount: 4,
        min: 0,
        labels: {
          offsetX: 0,
        },
        tooltip: {
          enabled: true
        }
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
      tooltip: {
        x: {
          format: "dd MMM yyyy"
        },
      },
      fill: {
        type: 'solid',
        opacity: [0.4, 0.25],
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
    }
  };



}
