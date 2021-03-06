import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { tap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './model';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';


@Injectable({
  providedIn: 'root'
})
export class EditService extends BehaviorSubject<any[]>{

  constructor(private http: HttpClient) {
    super([]);
}

private data: any[] = [];

public read() {
    if (this.data.length) {
        return super.next(this.data);
    }

    this.fetch()
        .pipe(
            tap((data:any[]) => {
                this.data = data;
            })
        )
        .subscribe(data => {
            super.next(data);
        });
}

public save(data: any, isNew?: boolean) {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();

    this.fetch(action, data)
        .subscribe(() => this.read(), () => this.read());
}

public remove(data: any) {
    this.reset();

    this.fetch(REMOVE_ACTION, data)
        .subscribe(() => this.read(), () => this.read());
}

public resetItem(dataItem: any) {
    if (!dataItem) { return; }

    // find orignal data item
    const originalDataItem = this.data.find(item => item.ProductID === dataItem.ProductID);

    // revert changes
    Object.assign(originalDataItem, dataItem);

    super.next(this.data);
}

public getSelectedRow(key:string):any{
  return this.data.filter( item => item.ProductName == key )[0];
}

private reset() {
    this.data = [];
}

private fetch(action: string = '', data?: any): Observable<any[]> {
    return this.http
        .jsonp(`https://demos.telerik.com/kendo-ui/service/Products/${action}?${this.serializeModels(data)}`, 'callback')
        .pipe(map(res => <any[]>res));
}

private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify([data])}` : '';
}

}
