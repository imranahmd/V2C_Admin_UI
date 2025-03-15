import {Injectable} from "@angular/core";
import Swal, {SweetAlertIcon, SweetAlertOptions} from "sweetalert2";
import {Observable} from "rxjs";

@Injectable()
export class AlertService {
  info: any;
  showError(Message: any) {
    throw new Error('Method not implemented.');
  }
    error(arg0: string) {
      throw new Error('Method not implemented.');
    }
  clear() {
    throw new Error('Method not implemented.');
  }
  constructor() {
  }

  simpleAlert(title: string, html?: string, icon?: SweetAlertIcon) {
    return Swal.fire(title, html, icon);
  }

  successAlert(title: string, html?: string) {
    return Swal.fire(title || 'Thank you...', html || '', 'success')
  }

  errorAlert(options?: SweetAlertOptions) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      // text: 'Something went wrong!',
      ...options
    })
  }

  warningAlert(options?: SweetAlertOptions) {
    return Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      // text: 'Something went wrong!',
      ...options
    })
  }

  topEndAlert(options?: SweetAlertOptions) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500,
      ...options
    })
  }

  confirmBox(confirmAction: any, options?: SweetAlertOptions, optionsSuccess?: SweetAlertOptions, successAction?: any, errorAction?:any, optionsCancel?:SweetAlertOptions ) {
    return Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      ...options
    }).then((result) => {
      console.log('confirm Action --->', result)
      if (result.value) {
        if (confirmAction?.subscribe) {
          return confirmAction.subscribe((data: any) => {
            if (data) {
              return Swal.fire(
                {
                  title: 'Deleted!',
                  html: 'Your imaginary file has been deleted.',
                  icon: 'success',
                  ...optionsSuccess
                }
              ).then((data) => {
                return successAction();
              })
            }
            return null;
          }, (error: any) => {
            console.log("Error:", error)
            return this.errorAlert();
          })
        }else{
          // console.log(confirmAction);
          try{
            return confirmAction().then(()=>{
              return Swal.fire(
                {
                  title: 'Deleted!',
                  html: 'Your imaginary file has been deleted.',
                  icon: 'success',
                  ...optionsSuccess
                }
              ).then((data) => {
                return successAction();
              })
            }).catch((e:any)=>{
              this.errorAlert();
              return errorAction && errorAction(e);
            });
          }catch (e:any) {
            // confirmAction();
            // return Swal.fire(
            //   {
            //     title: 'Deleted!',
            //     html: 'Your imaginary file has been deleted.',
            //     icon: 'success',
            //     ...optionsSuccess
            //   }
            // ).then((data) => {
            //   return successAction();
            // }).catch((err)=>{
            this.errorAlert();
              return errorAction && errorAction(e);
            // });
          }

        }

      } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: 'Cancelled',
          html: 'Your item is safe :)',
          icon: 'error',
          ...optionsCancel
        });
        return result;
      }
    })
  }

  directconfirmBox(confirmAction: any, options?: SweetAlertOptions, optionsSuccess?: SweetAlertOptions, successAction?: any, errorAction?:any, optionsCancel?:SweetAlertOptions ) {
    return Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      ...options
    }).then((result) => {
      console.log('confirm Action --->', result)
      if (result.value) {
        if (confirmAction?.subscribe) {
          return confirmAction.subscribe((data: any) => {
            if (data) {
              // return Swal.fire(
              //   {
              //     title: 'Deleted!',
              //     html: 'Your imaginary file has been deleted.',
              //     icon: 'success',
              //     ...optionsSuccess
              //   }
              // ).then((data) => {
              
              // })
              return successAction();
            }
            return null;
          }, (error: any) => {
            console.log("Error:", error)
            return this.errorAlert();
          })
        }else{
          // console.log(confirmAction);
          try{
            return confirmAction().then(()=>{
              // return Swal.fire(
              //   {
              //     title: 'Deleted!',
              //     html: 'Your imaginary file has been deleted.',
              //     icon: 'success',
              //     ...optionsSuccess
              //   }
              // ).then((data) => {
              // })
              return successAction();

            }).catch((e:any)=>{
              this.errorAlert();
              return errorAction && errorAction(e);
            });
          }catch (e:any) {
            // confirmAction();
            // return Swal.fire(
            //   {
            //     title: 'Deleted!',
            //     html: 'Your imaginary file has been deleted.',
            //     icon: 'success',
            //     ...optionsSuccess
            //   }
            // ).then((data) => {
            //   return successAction();
            // }).catch((err)=>{
            this.errorAlert();
              return errorAction && errorAction(e);
            // });
          }

        }

      } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
        // Swal.fire({
        //   toast: true,
        //   position: 'top-end',
        //   showConfirmButton: false,
        //   timer: 3000,
        //   timerProgressBar: true,
        //   title: 'Cancelled',
        //   html: 'Your item is safe :)',
        //   icon: 'error',
        //   ...optionsCancel
        // });
        return result;
      }
    })
  }
  cancelBox(confirmAction: any, options?: SweetAlertOptions, optionsSuccess?: SweetAlertOptions, successAction?: any) {
    return Swal.fire({
      title: 'Are you sure want to cancel?',
      text: 'You will not be able to undo this change!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep as it is',
      ...options
    }).then((result) => {
      if (result.value) {
        confirmAction.subscribe((data: any) => {
          if (data) {
            Swal.fire(
              {
                title: 'Cancelled!',
                html: 'Your record has been cancelled.',
                icon: 'success',
                ...optionsSuccess
              }
            ).then((data) => {
              successAction();
            })
          }
        }, (error: any) => {
          this.errorAlert();
          console.log("Error:", error)
        })

      } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: 'Cancelled',
          html: 'Your item is safe :)',
          icon: 'error'
        })
      }
    })
  }

  toastErrorMessageAlert(options?: SweetAlertOptions) {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      title: 'Error',
      html: 'Error occurred',
      icon: 'error',
      ...options
    })
  }
  toastErrorMessageAlertCenter(options?: SweetAlertOptions) {
    return Swal.fire({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      title: 'Error',
      html: 'Error occurred',
      icon: 'error',
      ...options
    })
  }

  toastSuccessMessageAlert(options?: SweetAlertOptions) {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      title: 'Success',
      html: 'Thank you...',
      icon: 'success',
      ...options
    })
  }

  toastWarringMessageAlert(options?: SweetAlertOptions) {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      title: 'Toast',
      html: 'Sample Toast Message',
      icon: 'warning',
      ...options
    })
  }

  //  ${action.toLowerCase()}.`
}
