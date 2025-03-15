import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {LoaderService} from "./_services/loader.service";
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'crm-portal-fe';
  isLoading: boolean;
  private subscriber$: Subscription;

  constructor(private loaderService: LoaderService,private swUpdate: SwUpdate) {
    this.swUpdate.available.subscribe(event => {
      if (confirm('A new version is available. Update now?')) {
        window.location.reload();
        window.location.href = window.location.href
        // window.location.reload(true);

      }
    });
  }

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.subscriber$ = this.loaderService.spinnerLoadingObserver.subscribe((val) => {
      this.isLoading = val as boolean;
    })
  }

  ngOnDestroy(): void {
    this.subscriber$.unsubscribe()
  }
  ngAfterViewInit() {
    this.loaderService.hideLoader();
  }
}
