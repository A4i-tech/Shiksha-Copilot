import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import { MasterService } from 'src/app/shared/services/master.service';
import { UserManagementService } from '../user-management/user-management.service';
import { Observable, Subject, Subscription, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { ContentActivityService } from './content-activity.service';
import { RegionDependency } from 'src/app/shared/interfaces/permission.interface';
import { pathAllowed, regionScopePaths } from 'src/app/shared/utility/scope.util';

@Component({
  selector: 'app-content-activity',
  templateUrl: './content-activity.component.html',
  styleUrls: ['./content-activity.component.scss']
})
export class ContentActivityComponent implements OnInit {

  searchText: any = "";
  currentPage = 1;
  totalItems = 0;
  pageSize = 10;
  listData:any[]=[];
  private searchTerms = new Subject<string>();
  table_headers = ['Teacher Name', 'Content Regenerated', 'Original Content','Status', 'Date of Modification'];

  stateDropdownOptions: any[] = [];
  stateDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select State',
    bindLabel: 'state',
    bindValue: 'state',
    clearableOff: false,
    labelTxt: 'State'
  };

  zoneDropdownOptions: any[] = [];
  zoneDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select Zone',
    bindLabel: 'name',
    bindValue: 'name',
    clearableOff: false,
    labelTxt: 'Zone'
  };

  districtDropdownOptions: any[] = [];
  districtDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select District',
    bindLabel: 'name',
    bindValue: 'name',
    clearableOff: false,
    labelTxt: 'District'
  };

  blockDropdownOptions: any[] = [];
  blockDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select Taluk',
    bindLabel: 'name',
    bindValue: 'name',
    clearableOff: false,
    labelTxt: 'Taluk'
  };

  schoolDropdownOptions: any[] = [];
  stateControl = new FormControl();
  zoneControl = new FormControl();
  districtControl = new FormControl();
  blockControl = new FormControl();
  schoolControl = new FormControl();
  schoolDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select School',
    bindLabel: 'name',
    bindValue: '_id',
    clearableOff: false,
    labelTxt: 'School',
    searchable: true
  };

  filterObj: any = {
    district: '',
    zone: '',
    block: '',
    _id: '',
    search: '',
  };

  regionsData: any;
  private scopePaths: Partial<RegionDependency>[] = [];

  selectedStateObj: any;

  selectedZoneObj: any;

  selectedDistrictObj: any;  

  selectedSchoolId: any;

  private searchSubscription!: Subscription;

  private paginationSubscription!: Subscription;


  constructor(private contentActivityService: ContentActivityService, private masterService: MasterService, private utilityService: UtilityService, private userManagementService: UserManagementService) { }

  ngOnInit(): void {
    this.getRegionsData();

    this.searchSubscription = this.searchTerms
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.onFilterChange('search', this.searchText);
      });
    this.getContentActivityData();

  }

  getContentActivityData(filters?: any) {
    let observable: Observable<any>;
      
    if (this.searchText.trim() !== '') {
      observable = this.contentActivityService.getContentActivityData(this.currentPage, this.pageSize, filters, this.searchText);
    } else {
      observable = this.contentActivityService.getContentActivityData(this.currentPage, this.pageSize, filters);
    }

    if(this.paginationSubscription){
      this.paginationSubscription.unsubscribe();
    }
  
    this.paginationSubscription = observable.subscribe({
      next: (res: any) => {
        this.listData = res.data['results'];
        this.totalItems = res.data.totalItems;
        if(this.totalItems <= 10){
          this.currentPage = 1;
        }
      },
      error: (err) => {
        this.utilityService.handleError(err);
      }
    });
  }

  searchInputChanged(event: any): void {
    this.searchTerms.next(event.target.value);
    this.currentPage = 1;
  }

  /**
   * Function to get regions data
   */
  getRegionsData() {
    this.masterService.getRegions().subscribe({
      next: (val) => {
        this.regionsData = val?.data?.results;
        const grants = this.utilityService.getPermission('content.activity.view')!;
        this.scopePaths = regionScopePaths(grants);
        const schoolGrants = grants.filter((grant) => grant.scopeType === 'SCHOOL');
        if (!schoolGrants.length) {
          this.setStateDropdownValues();
          return;
        }
        forkJoin(schoolGrants.map((grant) => this.userManagementService.getSchoolList(true, { _id: grant.dep }))).subscribe((responses) => {
          this.scopePaths.push(...responses.map((response) => response.data.results[0]));
          this.setStateDropdownValues();
        });
      },
    });
  }

  private setStateDropdownValues() {
    this.stateDropdownOptions = this.regionsData.filter((region: any) => pathAllowed(this.scopePaths, { state: region.state }));
    this.selectOnly('state', this.stateDropdownOptions, this.stateControl, 'state', (state) => this.setZoneDropdownValues(state));
    if (this.filterObj.state) this.getContentActivityData(this.filterObj);
  }

  /**
   * Function to set zone dropdown values
   * @param selectedStateValue
   */
  setZoneDropdownValues(selectedStateValue: any) {
    if (selectedStateValue) {
      this.selectedStateObj = this.utilityService.filterDropdownValues(
        this.regionsData,
        'state',
        selectedStateValue
      );
      this.zoneDropdownOptions = this.selectedStateObj.zones.filter((zone: any) => pathAllowed(this.scopePaths, { state: selectedStateValue, zone: zone.name }));
      this.selectOnly('zone', this.zoneDropdownOptions, this.zoneControl, 'name', (zone) => this.setDistrictDropdownValues(zone));
    } else {
      this.zoneDropdownOptions = [];
    }
  }

  /**
   * Function to set district dropdown values
   * @param selectedZone
   */
  setDistrictDropdownValues(selectedZone: any) {
    this.resetZone()
    if (selectedZone) {
      this.selectedZoneObj = this.utilityService.filterDropdownValues(
        this.selectedStateObj.zones,
        'name',
        selectedZone
      );
      this.districtDropdownOptions = this.selectedZoneObj.districts.filter((district: any) =>
        pathAllowed(this.scopePaths, { state: this.filterObj.state, zone: selectedZone, district: district.name }));
      this.selectOnly('district', this.districtDropdownOptions, this.districtControl, 'name', (district) => this.setBlockDropdownValues(district));
    }
  }

  /**
   * Function to set block dropdown values
   * @param selectedDistrict
   */
  setBlockDropdownValues(selectedDistrict: any) {
    this.resetDistrict()
    if (selectedDistrict) {
      this.selectedDistrictObj = this.utilityService.filterDropdownValues(
        this.selectedZoneObj.districts,
        'name',
        selectedDistrict
      );
      this.blockDropdownOptions = this.selectedDistrictObj.blocks.filter((block: any) =>
        pathAllowed(this.scopePaths, { state: this.filterObj.state, zone: this.filterObj.zone, district: selectedDistrict, block: block.name }));
      this.selectOnly('block', this.blockDropdownOptions, this.blockControl, 'name', () => this.getSchoolFilteredList());
    }
  }

  private selectOnly(type: string, options: any[], control: FormControl, valueKey: string, selected: (value: any) => void) {
    control.enable({ emitEvent: false });
    if (options.length !== 1) return;
    const value = options[0][valueKey];
    control.setValue(value, { emitEvent: false });
    control.disable({ emitEvent: false });
    this.filterObj[type] = value;
    selected(value);
  }

  onFilterChange(type: any, value: any) {
    this.filterObj[type] = value;
    if (value) {
      switch (type) {
        case 'state': this.setZoneDropdownValues(value);
          break;
        case 'zone': this.setDistrictDropdownValues(value);
          break;
        case 'district': this.setBlockDropdownValues(value);
          break;
        case 'block': this.getSchoolFilteredList();
        break; 
      }
    }
    else {
      switch (type) {
        case 'state': this.resetStates();
          break;
        case 'zone': this.resetZone();
          break;
        case 'district': this.resetDistrict();
          break;
        case 'block': this.resetBlock();
          break;
        
      }
    }
    this.currentPage = 1;
    this.getContentActivityData(this.filterObj);
  }

  /**
       * Function to get filtered school list
       */
  getSchoolFilteredList() {
    this.resetBlock();
    const filters = {
      state: this.filterObj.state,
      district: this.filterObj.district,
      zone: this.filterObj.zone,
      block: this.filterObj.block
    };
    this.userManagementService.getSchoolList(true, filters).subscribe((res: any) => {
      this.schoolDropdownOptions = res.data.results;
      this.selectOnly('_id', this.schoolDropdownOptions, this.schoolControl, '_id', () => this.getContentActivityData(this.filterObj));
    });
  }

  resetStates() {
    this.zoneControl.enable({ emitEvent: false });
    this.districtControl.enable({ emitEvent: false });
    this.blockControl.enable({ emitEvent: false });
    this.schoolControl.enable({ emitEvent: false });
    this.zoneDropdownOptions = [];
    this.districtDropdownOptions = [];
    this.blockDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.filterObj.zone = '';
    this.filterObj.district = '';
    this.filterObj.block = '';
    this.filterObj._id = '';
    this.zoneControl.reset();
    this.districtControl.reset();
    this.blockControl.reset();
    this.schoolControl.reset();
  }

  resetZone() {
    this.districtControl.enable({ emitEvent: false });
    this.blockControl.enable({ emitEvent: false });
    this.schoolControl.enable({ emitEvent: false });
    this.filterObj.district = '';
    this.filterObj.block = '';
    this.filterObj._id = '';
    this.districtDropdownOptions = [];
    this.blockDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.districtControl.reset();
    this.blockControl.reset();
    this.schoolControl.reset();
  }

  resetDistrict() {
    this.blockControl.enable({ emitEvent: false });
    this.schoolControl.enable({ emitEvent: false });
    this.filterObj.block = '';
    this.filterObj._id = '';
    this.blockDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.blockControl.reset();
    this.schoolControl.reset();
  }

  resetBlock() {
    this.schoolControl.enable({ emitEvent: false });
    this.filterObj._id = '';
    this.schoolDropdownOptions = [];
    this.schoolControl.reset();
  }

  /**
   * pagination
   */
  onPageChange(page: number): void {  
    this.currentPage = page;
    this.getContentActivityData(this.filterObj);
  }

  exportContentActivities(){
    if(!this.listData.length){
      return
    }
    this.contentActivityService.exportContentActivities(this.filterObj).
    subscribe({
      next:(res) => {
        this.utilityService.handleResponse(res)
      },
      error:(err)=>{
        this.utilityService.handleError(err)
      }
    })
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if(this.paginationSubscription){
      this.paginationSubscription.unsubscribe();
    }
  }


}
