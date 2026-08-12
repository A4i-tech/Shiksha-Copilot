import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, debounceTime, distinctUntilChanged, Observable, forkJoin } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { UserManagementService } from 'src/app/view/admin/user-management/user-management.service';
import { DropDownConfig } from '../../interfaces/dropdown.interface';
import { StaffUserCommonService } from '../../services/staff-user-common.service';
import { BULK_UPLOAD_FILE_TYPES } from '../../utility/constant.util';
import { ModalService } from '../modal/modal.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule } from '@ngx-translate/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { ModalComponent } from '../modal/modal.component';
import { DisablePopupComponent } from '../disable-popup/disable-popup.component';
import { UploadPopupComponent } from '../upload-popup/upload-popup.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HasPermissionDirective } from 'src/app/core/directives/has-permission.directive';
import { UploadErrorPopupComponent } from '../upload-error-popup/upload-error-popup.component';
import { MasterService } from '../../services/master.service';
import { SchoolManagementService } from 'src/app/view/admin/school-management/school-management.service';
import { SchoolList } from '../../interfaces/school-list.interface';
import { slideInOutAnimation } from '../../utility/animations.util';
import { ActionMenuController } from '../../utility/action-menu-controller.util';
import { RegionDependency } from '../../interfaces/permission.interface';
import { pathAllowed, regionScopePaths, scopeBelow } from '../../utility/scope.util';

interface ContentListConfig {
  [key: string]:
  {type:string, router: string, table_headers: any,download_file:string };
}

@Component({
  selector: 'app-user-staff-list',
  templateUrl: './user-staff-list.component.html',
  styleUrls: ['./user-staff-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownComponent,ModalComponent,DisablePopupComponent,UploadPopupComponent,PaginationComponent,TranslateModule, NgSelectModule,HasPermissionDirective, UploadErrorPopupComponent],
  animations:[slideInOutAnimation]
  
})
export class UserStaffListComponent implements OnInit,AfterViewInit{

  @ViewChild('dropdownContent') dropdownContent !: ElementRef;
  dropdownSubscription!: Subscription;
  
  usersList: any[] = [];
  schoolNamesDropdownOptions: any[]=[];

  userRolesDropdownOptions: any[] = [];

  userStatusDropdownOptions: any[]=[{ name: 'Active', value: 'active' },{ name: 'Inactive', value: 'inactive' }];

  trainingStatusDropdownOptions: any[] = [{ name: 'Trained', value: 'trained' }, { name: 'Untrained', value: 'untrained' }];

  districtDropdownOptions: any[] = [];

  stateDropdownOptions: any[] = [];

  blockDropdownOptions: any[] = [];

  zoneDropdownOptions: any[] = [];

  schoolDropdownOptions: any[] = [];
  stateControl = new FormControl();
  zoneControl = new FormControl();
  districtControl = new FormControl();
  blockControl = new FormControl();
  schoolControl = new FormControl();


  schoolNamesDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'School Name',
    bindLabel:'name',
    bindValue:'_id',
    labelTxt:"School Name",
    searchable: true
  };

  userRolesDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Type of Teacher',
    bindLabel:'name',
    bindValue:'_id',
    labelTxt:'Type of Teacher'
  };

  userStatusDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Status of user',
    bindLabel:'name',
    bindValue:'value',
    labelTxt:'Status of user'
  };

  trainingStatusDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Training Status',
    bindLabel:'name',
    bindValue:'value',
    labelTxt:'Training Status'
  };

  stateDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'State',
    bindLabel: 'state',
    bindValue: 'state',
    labelTxt: 'State'
  };

  districtDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'District',
    bindLabel: 'name',
    bindValue: 'name',
    labelTxt: 'District'
  };

  blockDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Taluk',
    bindLabel: 'name',
    bindValue: 'name',
    labelTxt: 'Taluk'
  };

  zoneDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Zone',
    bindLabel: 'name',
    bindValue: 'name',
    labelTxt: 'Zone'
  };

  schoolDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'School',
    bindLabel: 'name',
    bindValue: '_id',
    labelTxt: 'School',
    searchable: true
  };


  schoolId: any;

  tableData: any;

  modal_subheader = 'Are you sure you want to delete this Teacher? This cannot be undone.';

  showAdditionalFilters = false

  isEditing: boolean = false;
  userId!: string;
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  usersListWithoutPg!:any[];
  readonly actionMenu = new ActionMenuController();
  searchText: any = "";
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  selectedUser: any;
  private searchTerms = new Subject<string>();
  selectedRole!: string;
  selectedSchool!: string;
  uploadFileTypes = BULK_UPLOAD_FILE_TYPES;
  fileToUpload!: File;
  lessonContentType!: string | null;
  contentListConfig:ContentListConfig = {
    "/teachers/list": {
      type:'user',
      router: '/teachers/',
      table_headers: ['Teacher Name', 'Mobile Number', 'School Name', 'Type of Teacher', 'Status of Teacher', 'Training Status', ''],
      download_file:'user-management'

    },
    "/staff/list": {
      type:"admin",
      router: '/staff/',
      table_headers: ['Staff Name', 'Mobile Number', 'Type of staff', 'Status of staff', ''],
      download_file:'admin-shikshana-user-management'
    }
  }

  errorUrl:any;
  includeDeleted:number = 1;

  private searchSubscription!: Subscription;

  private paginationSubscription!: Subscription;

  private nonPaginationSubscription!: Subscription;

  regionsData: any;
  private scopePaths: Partial<RegionDependency>[] = [];

  selectedStateObj: any;

  selectedZoneObj: any;

  selectedDistrictObj: any;

  filterObj: any = {
    district: '',
    zone: '',
    block: '',
    school: '',
    search: '',
    includeDeleted:'',
    trainingStatus: ''
  };

  schoolListData!: [SchoolList];

  constructor(private elRef:ElementRef, private route: ActivatedRoute, private router: Router, public modalService: ModalService, private userManagementService: UserManagementService, public utility: UtilityService, private commonStaffUserService: StaffUserCommonService, private masterService:MasterService, private schoolManagementService:SchoolManagementService) {
    this.lessonContentType = this.router.url.split('?')[0];
    if (this.getType()?.type === 'admin') {
      this.userRolesDropdownconfig.placeHolderTxt ='Type of staff'
      this.modal_subheader = 'Are you sure you want to delete this Staff? This cannot be undone.';
    }
    
  }

  ngOnInit(): void {  
    this.onFilterChange('includeDeleted', this.includeDeleted);

    if (this.getType()?.type === 'user') {
      this.getRegionsData();
    }  

    this.getUsersList(this.filterObj);
    this.loadRoles();

    this.searchSubscription = this.searchTerms.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      this.onFilterChange('search', this.searchText);
    });
    this.updateDropdownConfig(this.getType()?.type);
  }

    /**
   * Function to get regions data
   */
    getRegionsData() {
      this.masterService.getRegions().subscribe({
        next: (val) => {
          this.regionsData = val?.data?.results;
          const grants = this.utility.getPermission('user.view')!;
          this.scopePaths = regionScopePaths(grants);
          const schoolGrants = grants.filter((grant) => grant.scopeType === 'SCHOOL');
          if (!schoolGrants.length) {
            this.setStateDropdownValues();
            return;
          }
          forkJoin(schoolGrants.map((grant) => this.schoolManagementService.getSchoolList(1, 1, { _id: grant.dep }))).subscribe((responses) => {
            this.scopePaths.push(...responses.map((response) => response.data.results[0]));
            this.setStateDropdownValues();
          });
        },
      });
    }

  private setStateDropdownValues() {
    this.stateDropdownOptions = this.regionsData.filter((region: any) => pathAllowed(this.scopePaths, { state: region.state }));
    this.selectOnly('state', this.stateDropdownOptions, this.stateControl, 'state', (state) => this.setZoneDropdownValues(state));
    if (this.filterObj.state) this.getUsersList(this.filterObj);
  }

  updateDropdownConfig(type: any): void {
    if (type === 'user') {
      this.userRolesDropdownconfig.placeHolderTxt = 'Type of Teacher';
      this.userRolesDropdownconfig.labelTxt = 'Type of Teacher';
      this.userStatusDropdownconfig.placeHolderTxt = 'Status of Teacher';
      this.userStatusDropdownconfig.labelTxt = 'Status of Teacher';
    } else if (type === 'admin') {
      this.userRolesDropdownconfig.placeHolderTxt = 'Type of Staff';
      this.userRolesDropdownconfig.labelTxt = 'Type of Staff';
      this.userStatusDropdownconfig.placeHolderTxt = 'Status of Staff';
      this.userStatusDropdownconfig.labelTxt = 'Status of Staff';
    }
  }
  

  ngAfterViewInit(): void {
    if(this.getType()?.type === 'user' && this.schoolId){
      this.schoolControl.setValue(this.schoolId);
    }
  }

  /**
   * provide the id of the logged user
   * @returns 
   */
  loggedUser(){
    return this.utility.loggedInUserData._id;
  }

  @HostListener('click', ['$event'])
  clickInside(event : MouseEvent){
    this.actionMenu.closeAllIfTriggeredInside(event, '.table-section');
  }

  viewUser(item: any) {
    this.router.navigate([`${this.getType()?.router}/${item._id}`], {
      queryParams: { mode: 'view' },
    });
  }

  editUser(item: any) {
    this.router.navigate([`${this.getType()?.router}/${item._id}`], {
      queryParams: { mode: 'edit' },
    });
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  openAddUserFormComp() {

    this.router.navigate([`${this.getType()?.router}/add`]);
  }

  openModalForDeleteConfirm(item: any) {
    this.modalService.showDeleteUserDialog = true;
    this.tableData = {
      id: item._id,
      header:this.getType()?.type === 'user' ? ['Teacher Name', 'Role Name', 'Status of Teacher'] : ['Staff Name', 'Role Name', 'Status of staff'],
      data: {
        status: item.isDeleted ? 'Inactive' : 'Active',
        isAction: true,
        user_name: item.identity.name,
        role_name: this.roleName(item),
        more_icon: false
      }
    }
  }

  loadRoles() {
    this.commonStaffUserService.getRoles().subscribe((res: any) => {
      this.userRolesDropdownOptions = this.getType()?.type === 'user'
        ? res.data.results.filter((role: any) => role.scopeType === 'SCHOOL')
        : res.data.results;
    });
  }

  roleName(item: any) {
    const roles = this.getType()?.type === 'user'
      ? item.roles.filter((assignment: any) => assignment.role.scopeType === 'SCHOOL')
      : item.roles;
    return roles.map((assignment: any) => assignment.role.name).join(', ');
  }

  ondisableUser(item: any) {
    this.commonStaffUserService.deactivate(item.id).subscribe({
      next: (res: any) => {
        this.modalService.showDeleteUserDialog = false;
        this.utility.handleResponse(res);
        this.getUsersList();
      },
      error: (err) => {
        console.error(err);
        this.utility.handleError(err);
      },
    });
  }

  searchInputChanged(event: any): void {   
    this.searchTerms.next(event.target.value);
    this.currentPage = 1;
  }
  
  onRoleChange(role:any){
    this.selectedRole = role;
    this.currentPage=1;
    this.getUsersList();
  }

  onTrainingStatusChange(trainingStatus:any){
    this.currentPage=1;
    this.onFilterChange('trainingStatus', trainingStatus);
  }

  onStatusChange(status: any): void {
    this.currentPage = 1;
    if (status) {
      if (status === 'active') {
        this.includeDeleted = 0; 
      } else if (status === 'inactive') {
        this.includeDeleted = 2;  
      }
    } else {
      this.includeDeleted = 1;    
    }
    this.onFilterChange('includeDeleted', this.includeDeleted)
  }
  
  toggleFilter(){
    if(this.showAdditionalFilters && this.filterObj?.state && !this.stateControl.disabled){
      this.onFilterChange('state',null)
    }
    this.showAdditionalFilters = !this.showAdditionalFilters;
  }
  
  getUsersList(filter?: any): void {
    const profileType = this.getType()?.type === 'user' ? 'teacher' : 'admin';
    const observable = this.commonStaffUserService.list({
      profileType,
      page: this.currentPage,
      limit: this.pageSize,
      filters: filter,
    });

    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }

    this.paginationSubscription = observable.subscribe({
      next: (res: any) => {
        if (res?.data?.results) {
          this.usersList = res.data.results;
          this.totalItems = res.data.totalItems;
        } else {
          this.usersList = [];
          this.totalItems = 0;
        }
      },
      error: (err) => {
        console.error('Error while fetching list', err);
        this.usersList = [];
        this.totalItems = 0;
      },
    });
  }

  /**
   * Function to open bulk upload popup
   */
  blukUpload() {
    this.modalService.showBlukUploadDialog = true;
  }

  /**
   * Function triggerd on file upload
   * @param fileDetails
   */
  uploadedFile(fileDetails: any) {    
    this.fileToUpload = fileDetails.file;
  }

  /**
   * Function triggered on upload
   * @param isUpload
   */
  upload(isUpload: boolean) {
    if (isUpload && this.fileToUpload) {
      const formData = new FormData();
      formData.append('file', this.fileToUpload);

      this.commonStaffUserService.importUsers(formData).subscribe({
        next: (res: any) => {
          this.utility.showSuccess(res.message);
          this.modalService.showBlukUploadDialog = false;
        },
        error: (err) => {
          if (err?.error?.errorUrl) {
            this.errorUrl = err?.error?.errorUrl;
            this.modalService.showBlukUploadDialog = false;
            this.modalService.showUploadErrorDialog = true;
          } else {
            this.utility.showError(err.error.message);
          }
        },
      });
    }
  }

/**
   * pagination
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.getUsersList(this.filterObj);
  }

  getType() {
    if (this.lessonContentType) {
      return this.contentListConfig[this.lessonContentType];
    } else {
      return null;
    }
  }

  canManage(item: any, permission: string) {
    if (this.utility.loggedInUserData.isSuperUser) return true;
    const grants = this.utility.getPermission(permission);
    return grants && item.roles.every((assignment: any) =>
      scopeBelow(grants, assignment.role.scopeType, assignment.role.scopeType === 'SCHOOL' ? item.school : assignment.dep));
  }

  activateUser(id: any) {
    this.commonStaffUserService.activate(id).subscribe({
      next: (res: any) => {
        this.utility.handleResponse(res);
        this.getUsersList();
      },
      error: (err) => {
        this.utility.handleError(err);
      },
    });
  }

  exportUsersListToExcel() {
    if (!this.usersList.length) {
      return;
    }
    this.commonStaffUserService.exportTeachers(this.filterObj).subscribe({
      next: (res) => {
        this.utility.handleResponse(res);
      },
      error: (err) => {
        this.utility.handleError(err);
      },
    });

  }

  navigateToTraining() {
    this.router.navigate(['/training']);
  }
  
  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
    this.getUsersList(this.filterObj)
  }


        /**
       * Function to get filtered school list
       */
        getSchoolFilteredList() {
          this.resetBlock();
          const filters = {
            state:this.filterObj.state,
            district:this.filterObj.district,
            zone:this.filterObj.zone,
            block:this.filterObj.block
          }
          this.userManagementService.getSchoolList(true,filters).subscribe((res: any) => {
            this.schoolDropdownOptions = res.data.results;
            this.selectOnly('school', this.schoolDropdownOptions, this.schoolControl, '_id', () => this.getUsersList(this.filterObj));
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
        this.filterObj.school = ''
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
        this.filterObj.school = '';
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
    this.filterObj.school = '';
        this.blockDropdownOptions = [];
        this.schoolDropdownOptions = [];
        this.blockControl.reset();
        this.schoolControl.reset();
  }

  resetBlock() {
    this.schoolControl.enable({ emitEvent: false });
    this.filterObj.school = '';
        this.schoolDropdownOptions = [];
        this.schoolControl.reset();
  }

  /**
   * Function to get school list data
   */
  getShcoolList(filter?: any): void {
    let observable: Observable<any>;

    if (filter) {
      observable = this.schoolManagementService.getSchoolList(
        this.currentPage,
        this.pageSize,
        filter
      );
    } else {
      observable = this.schoolManagementService.getSchoolList(
        this.currentPage,
        this.pageSize
      );
    }


    if(this.paginationSubscription){
      this.paginationSubscription.unsubscribe();
    }

    this.paginationSubscription = observable.subscribe({
      next: (res: any) => {
        this.schoolListData = res.data['results'];
        this.totalItems = res.data.totalItems;
        if(this.totalItems <= 10){
          this.currentPage = 1;
        }
      },
      error: (err) => {
        console.error('Error while fetching list', err);
      },
    });
  }


    /**
   * Function to set zone dropdown values
   * @param selectedStateValue
   */
    setZoneDropdownValues(selectedStateValue: any) {
      if (selectedStateValue) {
        this.selectedStateObj = this.utility.filterDropdownValues(
          this.regionsData,
          'state',
          selectedStateValue
        );
        this.zoneDropdownOptions = this.selectedStateObj.zones.filter((zone: any) => pathAllowed(this.scopePaths, { state: selectedStateValue, zone: zone.name }));
        this.selectOnly('zone', this.zoneDropdownOptions, this.zoneControl, 'name', (zone) => this.setDistrictDropdownValues(zone));
      }
    }
  
    /**
     * Function to set district dropdown values
     * @param selectedZone
     */
    setDistrictDropdownValues(selectedZone: any) {
      this.resetZone()
      if (selectedZone) {
        this.selectedZoneObj = this.utility.filterDropdownValues(
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
        this.selectedDistrictObj = this.utility.filterDropdownValues(
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

  
  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if(this.paginationSubscription){
      this.paginationSubscription.unsubscribe();
    }

    if(this.nonPaginationSubscription){
      this.nonPaginationSubscription.unsubscribe()
    }
  }

}
