import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-bank',
  templateUrl: './service-bank.component.html',
  styleUrls: ['./service-bank.component.scss']
})
export class ServiceBankComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
    // this.refundData = false
    // this.resetform()
    // this.resetBulkform()
    // this.array =[]
  }

}
