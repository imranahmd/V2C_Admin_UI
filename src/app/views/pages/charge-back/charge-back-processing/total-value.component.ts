
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
// import { ReconManagementService } from './recon-management.service';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import * as $ from "jquery";
import { ModalConfig } from 'src/app/common/modal/modal.config';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'
@Component({
    selector: 'total-component',
    template: `

  

    <span>
      <span>{{ cellValue }}</span >
  
      &nbsp;
    
      <ng-select placeholder="Merchant" id="merchantId"  
       maxlength="500">
      <ng-option >
        hello
      </ng-option>
  </ng-select>


  <input type="text">
    </span>
   



  `,

    
    
})
export class TotalValue  implements ICellRendererAngularComp {
//     &nbsp;
//     <button type="button"  (click)="buttonView()"
//     [class]="'btn btn-outline-primary btn-icon '">
// <i class="feather icon-download-cloud " ></i> </button>
    public cellValue!: string;
    fileId: any;
    modalConfigBlocked: ModalConfig;
    @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modalbloked') private modalblockedComponent: ModalComponent;
  
    constructor( ) {

    }

    // gets called once before the renderer is used
    agInit(params: ICellRendererParams): void {
        debugger
        // document?.getElementById('show')?.style.visibility = 'hidden';
       
        this.modalConfigBlocked = {
            modalTitle: "Transaction Details",
            modalSize: 'lg',
            hideDismissButton(): boolean {
              return true
            },
            hideCloseButton(): boolean {
              return true
            }
          }
        this.cellValue = this.getValueToDisplay(params);
        this.fileId = params.data.FileId
    }

    // gets called whenever the user gets the cell to refresh
    refresh(params: ICellRendererParams) {
        // set value into cell again
        this.cellValue = this.getValueToDisplay(params);
        return true;
    }

    buttonClicked() {
        debugger
        let data = {
            "FileId": this.fileId.toString()
        }
        var random3 = Math.floor(Math.random() * 10000000000 + 1);
        var today = new Date();
        var referenceId = today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2)
        var fileName = 'Rewardoo_' + referenceId + random3 + '.xlsx'
        // this.reconService.getreport(data).subscribe((res: any) => {
        //     var response = res;
        //     this.exportAsExcelFile(res, fileName);
        // })
        // alert(`${this.cellValue} medals won!`);
    }
    buttonView() {debugger
        // return  this.modalblockedComponent.open();
        document.querySelectorAll('input[type="hidden"]').forEach(element => {debugger
            // (element)?.value= this.fileId.toString()
          });
        document?.getElementById("reconView")?.click();
         localStorage.setItem('fileID',this.fileId.toString())
    //  $('#reconId').val(this.fileId.toString())
     
        // if(document.querySelector<HTMLElement>('#reconView')){
        //     document?.querySelector<HTMLElement>('#reconView')?.value = 'pink';
        // }
        // document?.getElementById("reconView")?.value = "My value";
      
        // alert(`${this.cellValue} view won!`);
    }
    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
    }
    getValueToDisplay(params: ICellRendererParams) {
        return params.valueFormatted ? params.valueFormatted : params.value;
    }

}