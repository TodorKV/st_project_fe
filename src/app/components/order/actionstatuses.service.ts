import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { ActionStatus } from 'src/app/common/order';

@Injectable({
  providedIn: 'root'
})
export class ActionstatusesService {
  public actionStatuses: ActionStatus[] = [];
  public currentActionStatus = new ActionStatus;

  //refresh order history
  public refresh!: Observable<boolean>;
  private refreshSubject!: BehaviorSubject<boolean>;

  //refresh actionStatius View
  public close!: Observable<boolean>;
  private closeSubject!: BehaviorSubject<boolean>;


  constructor() {
    this.refreshSubject = new BehaviorSubject<boolean>(false);
    this.refresh = this.refreshSubject.asObservable();

    this.closeSubject = new BehaviorSubject<boolean>(false);
    this.close = this.closeSubject.asObservable();
  }

  public getCurrentActionStatus(): ActionStatus {
    return this.currentActionStatus;
  }

  public setCurrentActionStatus(currentActionStatus: ActionStatus): void {
    this.currentActionStatus = currentActionStatus;
  }

  public getActionStatuses(): ActionStatus[] {
    return this.actionStatuses;
  }

  public setActionStatuses(actionStatuses: ActionStatus[]): void {
    this.actionStatuses = actionStatuses;
  }

  set refreshTrigger(newValue: boolean) {
    this.refresh = of(newValue);
    this.refreshSubject.next(newValue);
  }

  set closeTrigger(newValue: boolean) {
    this.close = of(newValue);
    this.closeSubject.next(newValue);
  }

}