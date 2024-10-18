// rent.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentService {
  private refreshListSource = new Subject<void>();  // Subject to trigger refresh

  refreshList$ = this.refreshListSource.asObservable();  // Observable to listen for refresh

  // Method to trigger refresh
  triggerRefresh() {
    this.refreshListSource.next();
  }
}
