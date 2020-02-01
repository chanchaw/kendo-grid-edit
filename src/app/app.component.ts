import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GridDataResult, SelectableSettings } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { Product } from './model';
import { EditService } from './edit.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'grideditor';

  public view: Observable<GridDataResult>;
  public gridState: State = {
      sort: [],
      skip: 0,
      take: 10
  };

  public editDataItem: Product;
  public isNew: boolean;
  // private editService: EditService;



  // constructor(@Inject(EditService) editServiceFactory: any) {
  //     this.editService = editServiceFactory();
  // }


  public checkboxOnly = false;
  public mode = 'single';
  public selectableSettings: SelectableSettings;
  public mySelection: string[] = [];
  public selectedRow:Product = new Product();
  public selectedAssets:any = {};
  
  constructor(
    private editService:EditService
  ) {
    // this.editService = editServiceFactory();
    this.setSelectableSettings();
  }

  public setSelectableSettings(): void {
    this.selectableSettings = {
        checkboxOnly: this.checkboxOnly,
        mode: 'single'
    };
}


  public ngOnInit(): void {
      this.view = this.editService.pipe(map(data => process(data, this.gridState)));

      this.editService.read();
  }

  public onStateChange(state: State) {
      this.gridState = state;

      this.editService.read();
  }

  public addHandler() {
      this.editDataItem = new Product();
      this.isNew = true;
  }

  public editHandler({dataItem}) {
      // if( dataItem === undefined || dataItem === null ){
      //   this.editDataItem = this.selectedRow;
      // }else{
      //   this.editDataItem = dataItem;
      // }
      this.editDataItem = dataItem;
      this.isNew = false;
  }

  public cancelHandler() {
      this.editDataItem = undefined;
  }

  public saveHandler(product: Product) {
      this.editService.save(product, this.isNew);

      this.editDataItem = undefined;
  }

  public removeHandler({dataItem}) {
      this.editService.remove(dataItem);
  }


  

  onButtonClick(){
    // console.log(this.mySelection);
    // console.log(this.editService.getSelectedRow(this.mySelection[0]));
    // this.editHandler(this.editService.getSelectedRow(this.mySelection[0]));

  }

  onClickRow(){
    alert('点击了行');
  }


  onCellClick(e){
    console.log(e);
    this.selectedRow = e.dataItem;
    this.selectedAssets = e;
  }
}
