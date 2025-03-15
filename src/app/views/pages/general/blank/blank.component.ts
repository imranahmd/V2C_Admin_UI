import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/views/pages/auth/auth.service';
import { MenusService } from 'src/app/_services/menu.service';
import { UserService } from 'src/app/_services/user.service';
import { GeneralService } from '../general.service';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { environment } from 'src/environments/environment';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/_services/loader.service';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';


const { API_URL } = environment;
@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss'],
  preserveWhitespaces: true

})
export class BlankComponent implements OnInit {
  UserType: any
  @ViewChild('ref', { read: ElementRef }) ref: ElementRef;

  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;

  public monthlySalesChartOptions1: any = {};
  public monthlySalesChartOptions2: any = {};
  public monthlySalesChartOptions3: any = {};

  // colors and font variables for apex chart
  obj = {
    primary: "#6571ff",
    secondary: "#7987a1",
    success: "#05a34a",
    info: "#66d1d1",
    warning: "#fbbc06",
    danger: "#ff3366",
    light: "#e9ecef",
    dark: "#060c17",
    muted: "#7987a1",
    gridBorder: "rgba(77, 138, 240, .15)",
    bodyColor: "#000",
    cardBg: "#fff",
    fontFamily: "'Roboto', Helvetica, sans-serif"
  }
  MinDate: any = { day: (this.calendar.getToday().day - 30) > 0 ? (this.calendar.getToday().day - 30) : this.calendar.getToday().day, month: (this.calendar.getToday().day - 30) > 0 ? this.calendar.getToday().month : this.calendar.getToday().month - 1, year: (this.calendar.getToday().month - 1) == 0 ? this.calendar.getToday().year - 1 : this.calendar.getToday().year }
  newMinDate: any = this.calendar.getToday()
  currentDate: any;
  newcurrentDate: any;
  admindata: {};
  result: any;
  customDate: any = false
  DateCustom: any = false
  date: any;
  value: any = 10;
  userData: any;
  currentNewDate: any;
  newDate: any = this.calendar.getToday();
  Resdata: any;
  @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() BlockedmerchantSelectEvent1: EventEmitter<any> = new EventEmitter<any>();
  tableInfo: any;
  MerchantId: any
  VPAId: any = null
  hoveredDate: NgbDate | null = null;
  selected: { startDate: Dayjs, endDate: Dayjs };
  future: { startDate: Dayjs, endDate: Dayjs };

  fromDate: any | null;
  toDate: any | null;
  currentWeek: number;
  currentMonth: any = [];
  month: any;
  firstDate: any = {};
  currentYear: number;
  active: boolean[] = [true, false, false];
  monthName: any = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  loader: boolean = true;
  ResdataX: any;
  
  

  constructor(private calendar: NgbCalendar, private loaderService: LoaderService, private apiHttpService: ApiHttpService, private menuService: MenusService, private user: UserService, private general: GeneralService, private datepipe: DatePipe, private authService: AuthService,
    private alertService: AlertService, public formatter: NgbDateParserFormatter) {
    // this.fromDate = calendar.getNext(calendar.getToday(), 'd', -10);
    // this.toDate = calendar.getToday();
    this.TodayDate()
   
    
  }

  ngOnInit(): void {
    // this.loaderService.showLoader();
    this.future = {
      startDate: dayjs(),
      endDate: dayjs()
    }
    this.MerchnatList()
    this.VPAList()
    const dateCopy = new Date();
    this.newMinDate = { day: this.MinDate.day, month: (this.MinDate.month == 0) ? this.MinDate.month + 12 : this.MinDate.month, year: this.MinDate.year }
    //  this.newMinDate = {day:3,   month:2, year:2023}
    dateCopy.setDate(dateCopy.getDate() + 1);
    // this.date=this.datepipe.transform(dateCopy ,"MMM dd yyyy");
    this.date = this.datepipe.transform(dateCopy, "MM/dd/yyyy");
    // this.currentDate=this.datepipe.transform(dateCopy ,"yyyy-MM-dd");
    var type: any = localStorage?.getItem('menuItems')
    this.UserType = JSON.parse(type)?.finalMenus[0].ROLENAME
    this.currentDate = this.calendar.getToday()
    this.newcurrentDate = this.calendar.getToday()
    this.user.getUserProfileNew().subscribe((res) => {
      this.userData = res.USERID
      this.UserType = res.Menu[0].ROLENAME
      const { Menu } = res;
      const menuData = this.menuService.structuredMenu(Menu)
      if (menuData.finalMenus[0].ROLENAME == "Reseller" || menuData.finalMenus[0].ROLENAME == "Merchant") {
        this.alertService.errorAlert({
          title: "No Access! Contact Administrator",
          backdrop: true,
          toast: true,
          timer: 2000, position: 'top-end'
        })
        this.authService.logout();
      }
      this.dashBoard('search');
      this.DateCustom = false
    })
    // var DateCustom =false
    //     window.addEventListener('click', function(e:any){ debugger

    //       if (document.getElementById('clickbox')?.contains(e?.target)){
    //         // Clicked in box
    //         console.log('Clicked in box')
    //       } else{
    //          DateCustom=false
    //          console.log(' Clicked outside the box')
    //         // Clicked outside the box

    //       }

    //     });
    //     this.DateCustom = DateCustom
    //   this.toDate.valueChanges.subscribe((value:any) => {debugger
    //   // this.todate.valuech.subscribe(message => {
    //     if (value !=''||value !=null) {
    //       this.DateCustom = false
    //     }
    // });
  }

  click() {
    debugger
    document.getElementById('fromDate')?.click()
    console.log('hi')
  }
  onDateSelection(date: NgbDate) {
    debugger
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      if (this.toDate != '' || this.toDate != null) {
        this.DateCustom = false
        this.dashBoard('');
      }
    } else {
      this.toDate = null;
      this.fromDate = date;
    }


  }
  datechange(event: any) {
    debugger
    var startday = {
      day: event?.startDate?.$D || event?.start?.$D,
      month: (event?.startDate?.$M + 1) || (event?.start?.$M + 1),
      year: event?.startDate?.$y || event?.start?.$y
    }
    var endday = {
      day: event?.endDate?.$D || event?.end?.$D,
      month: (event?.endDate?.$M + 1) || (event?.end?.$M + 1),
      year: event?.endDate?.$y || event?.end?.$y
    }
    this.fromDate = startday
    this.toDate = endday
  }
  closeFix(event: any, datePicker: any) {
    if (event?.target.offsetParent == null)
      datePicker.close();
    else if (event?.target.offsetParent.nodeName != "NGB-DATEPICKER")
      datePicker.close();
  }
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }


  get2String(param: any) {
    return param.toString().slice(-2)
  }

  MerchnatList() {


    var merchantdata = {
      "name": ""
    }
    this.apiHttpService
      .post(
        `${API_URL}/GetMerchant/`, merchantdata
      )
      .subscribe((res: any) =>
        (this.Resdata = res));


  }

  VPAList() {


    let serviceprovidedata = {
      "Type": "52",
      "Value": ""
    }
    this.apiHttpService
      .post(`${API_URL}/GetDropdown`, serviceprovidedata)
      .subscribe((res) => {
        this.ResdataX = res
      });

  }

  dashBoard(param: any) {
    debugger
    this.loader = true
    this.datechange(this.selected)
    // this.loaderService.showLoader();
    if (param == 'search') {
      this.DateCustom = true
    } else {
      this.DateCustom = false
    }
    this.currentDate = this.fromDate
    this.newcurrentDate = this.toDate
    this.tableInfo = {
      MID: this.MerchantId || 'admin',
      date: this.currentDate.year + "-" + this.currentDate.month + "-" + this.currentDate.day + '#' + this.newcurrentDate.year + "-" + this.newcurrentDate.month + "-" + this.newcurrentDate.day + ('#' + this?.VPAId || ''),
      type: param
    }
    if (document.getElementById("home")?.classList.contains("show")) {
      this.BlockedmerchantSelectEvent.emit(this.tableInfo);

    } else if (document.getElementById("profile")?.classList.contains("show")) {
      this.BlockedmerchantSelectEvent1.emit(this.tableInfo);
    }
    // this.loaderService.hideLoader();
    this.loader = false


  }
  OnlyNumbersAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event?.which) ? event?.which : event?.keyCode;
    return (charCode > 47 && charCode < 58);

  }


  cycle() {
    debugger
    // this.lifecycle = true
    // this.bulkfile = false
    document.getElementById("home")?.classList.add("show")
    document.getElementById("profile")?.classList.remove("show")
    document.getElementById("home")?.classList.add("active")
    document.getElementById("profile")?.classList.remove("active")

    document.getElementById("home-line-tab")?.classList.add("active")
    document.getElementById("profile-line-tab")?.classList.remove("active")
    this.BlockedmerchantSelectEvent.emit(this.tableInfo);
    // this.BlockedmerchantSelectEvent1.emit(this.tableInfo);
    // this.refundData = false
    // this.resetform()
    // this.resetBulkform()
    // this.array =[]
  }
  bulk() {
    debugger
    // this.bulkfile = true
    // this.lifecycle = false
    document.getElementById("profile")?.classList.add("show")
    document.getElementById("home")?.classList.remove("show")
    document.getElementById("profile")?.classList.add("active")
    document.getElementById("home")?.classList.remove("active")

    document.getElementById("profile-line-tab")?.classList.add("active")
    document.getElementById("home-line-tab")?.classList.remove("active")
    // this.BlockedmerchantSelectEvent.emit(this.tableInfo);
    this.BlockedmerchantSelectEvent1.emit(this.tableInfo);
    // this.refundData = false
    // this.resetform()
    // this.resetBulkform()
    // this.array =[]
  }

  choosedDate(event: any) {
    debugger
  }
  ranges: any = {
    // 'Today': [dayjs(), dayjs()],
    // 'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    // 'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    // 'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    // 'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    // 'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
  TodayDate() {
    debugger
    this.active = [true, false, false, false]
    // this.fromDate =  this.calendar.getToday();
    // var startday:any=new Date(this.calendar.getToday().year, this.calendar.getToday().month - 1, this.calendar.getToday().day);
    //  var newdayjs ={
    //   $D: this.calendar.getToday().day,
    //   $H: 23,
    //   $L: "en",
    //   $M: this.calendar.getToday().month-1,
    //   $W: 3,
    //   $d: {

    //   },
    //   $isDayjsObject: true,
    //   $m: 59,
    //   $ms: 0,
    //   $s: 59,
    //   $u: true,
    //   $x: {

    //   },
    //   $y: this.calendar.getToday().year
    // }
    //   this.selected.startDate = moment().subtract(4, 'days').startOf('day');
    // this.selected.endDate = moment().subtract(1, 'days').startOf('day');
    this.selected = {
      startDate: dayjs(),
      endDate: dayjs()
    }
    this.datechange(this.selected);
    // this.toDate = this.calendar.getToday();
    this.dashBoard('');

  }

  WeekDate() {
    debugger
    this.active = [false, true, false, false]
    // alert (this.calendar.getWeekday(this.calendar.getToday()))
    // this.currentWeek = this.calendar.getWeekday(this.calendar.getToday());
    // this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -this.currentWeek + 1);
    // this.toDate = this.calendar.getToday();
    this.selected = {
      startDate: dayjs().startOf('week'),
      endDate: dayjs()
    }
    this.datechange(this.selected);
    this.dashBoard('');

  }

  MonthDate() {
    debugger
    this.active = [false, false, true, false]

    // this.currentMonth=this.calendar.getToday().month
    // this.currentYear=this.calendar.getToday().year
    // this.firstDate={

    // }
    this.selected = {
      startDate: dayjs().startOf('month'),
      endDate: dayjs()
    }
    this.datechange(this.selected);
    // this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -this.calendar.getToday().day + 1);
    // this.toDate = this.calendar.getToday();
    this.dashBoard('');
  }

  CustomDate() {
    debugger
    this.active = [false, false, false, true]
    this.DateCustom = true
    // this.fromDate = {day  :  1,      month :       11, year :       2023}
    // this.toDate = {}
    this.selected = {
      startDate: dayjs(),
      endDate: dayjs()
    }
    this.datechange(this.selected);
    // document.getElementById('datePickerElement')?.click()
    // openDatepicker() 
    // this.pickerDirective.open()
    // this.ref?.click()
    let element: HTMLElement = document.getElementsByClassName('datePickerElement')[0] as HTMLElement;
    element.click();
    this.dashBoard('');

    // this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -10);
    // this.toDate = this.calendar.getToday();
  }

  getMonthName(param: any) {
    // return this.monthName[param-1].substring(0,3)
  }


 
}
