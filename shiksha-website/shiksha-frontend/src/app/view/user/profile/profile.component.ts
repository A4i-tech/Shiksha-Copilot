import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { languege } from 'src/app/shared/utility/languege.util';
import { ProfileService } from './profile.service';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { SidebarService } from 'src/app/layout/sidebar/sidebar.service';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  showDeleteClassDetailsConfirm!: boolean;
  showDeleteResourceConfirm!: boolean;
  selectedClassIndex!:any;
  selectedResIndex!:any;
  languageConfig = languege;

  langDropDownConfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Select Preferred Language',
    fieldName: 'languege',
  };

  submitted: boolean = false;

  boardDropdownOptions: any[] = [];
  boardTypeDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Select board',
    fieldName: 'Board',
    hideLabel: true,
    bindLabel: '_id',
    bindValue: '_id',
  };

  mediumDropdownOptions: any[] = [];
  mediumTypeDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Select medium',
    fieldName: 'Medium',
    hideLabel: true,
    bindLabel: 'medium',
    bindValue: 'medium',
  };

  classDropdownOptions: any[] = [];
  classTypeDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Select class',
    fieldName: 'Standard',
    hideLabel: true,
    bindLabel: 'standard',
    bindValue: 'standard',
  };

  subjectDropdownOptions: any[] = [];
  subjectTypeDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Select subject',
    fieldName: 'Subject',
    hideLabel: true,
    bindLabel: 'displayName',
    bindValue: '_id',
  };

  resourceTypeDropdownOptions: any[] = [];
  resourceTypeDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Select Resource',
    fieldName: 'Resource Type',
    hideLabel: false,
    bindLabel: 'type',
    bindValue: 'type',
  };

  resourceTypeDarkDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select Type',
    fieldName: 'Resource Type',
    hideLabel: false,
    bindLabel: 'type',
    bindValue: 'type',
  };

  resourceDetailsDropdownOptions: any[] = [];
  resourceDetailsDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Select details',
    fieldName: 'Resource Details',
    multi: true,
    clearableOff: true,
    hideLabel: true,
  };
  resourceOtherDetailsDropdownconfig: DropDownConfig = {
    ...this.resourceDetailsDropdownconfig,
    placeHolderTxt: 'Enter resource details',
    hideLabel: false,
    searchable: true,
    addTag: true,
  };

  userData: any;
  userPorfileForm!: FormGroup;
  loggedInUser: any;
  isTeacher!: boolean;
  dependentPatchData: any;
  resourceMasterData: any;
  boardMasterData: any;

  schoolTableHeader = [
    'Board',
    'Medium',
    'Class / Grade',
    'Subject',
    'No. of Boys',
    'No. of Girls',
    'Action',
  ];

  patchObj: any;

  defaultBoard = null;

  showDeleteProfileImageConfirm =false;

  currentSubjects:any[]=[];

  constructor(
    private fb: FormBuilder,
    private service: ProfileService,
    private utilityService: UtilityService,
    private masterService: MasterService,
    public sidebarService: SidebarService,
    public translateService: TranslateService
  ) {}

  /**
   * Angular oninit lifecycle hook used here for form initialization
   */
  ngOnInit(): void {
    const data: string = localStorage.getItem('userData') ?? '';
    this.loggedInUser = JSON.parse(data);
    this.isTeacher = Boolean(this.loggedInUser.profiles.teacher);
    this.createUserForm();
    this.getData();
  }

  /**
   * Function to get all master data and profile data
   */
  getData() {
    const userProfile = this.service.getProfileInfo(this.loggedInUser._id);
    if (!this.isTeacher) {
      userProfile.subscribe({ next: (profile) => this.setProfileInfo(profile), error: (err) => this.utilityService.handleError(err) });
      return;
    }

    const boardMaster = this.service.getClassesByBoard(this.loggedInUser.school._id);
    const resourceMaster = this.masterService.getFacilities();
    forkJoin([boardMaster, resourceMaster, userProfile]).subscribe({
      next: ([boardRes, resourceRes, profileRes]) => {
        this.setClassesByBoard(boardRes);
        this.setResourceData(resourceRes);
        this.setProfileInfo(profileRes);
      },
      error:(err)=>{
        this.utilityService.handleError(err)
      }
    });
  }

  setClassesByBoard(val:any) {
    this.boardMasterData = val.data;
    this.boardDropdownOptions = val.data;
    this.presetValues(this.boardMasterData);
  }

  /**
   * Function to get set present value if one board or medium
   * @param data
   */
  presetValues(data: any) {
    if (data.length === 1) {
      this.defaultBoard = data[0]._id;
    }
  }

  /**
   * Function to set section and subject
   * @param i
   * @param val
   */
  setMediumSubjectDropdown(i: any, val: any) {
    this.resetclassInfo('board', i);
    if (val) {
      this.mediumDropdownOptions[i] = val.medium;
      this.currentSubjects[i] = val.subjects;
      // this.subjectDropdownOptions[i] = val.subjects;
      if (val.medium.length === 1) {
        this.classes.controls[i].get('medium')?.setValue(val.medium[0].medium);
        this.classes.controls[i].get('medium')?.disable();
        this.setClassDropdown(i, val.medium[0]);
      }
    }
  }

  setClassDropdown(i: any, val: any) {
    this.resetclassInfo('medium', i);
    if (val) {
      this.classDropdownOptions[i] = val.classDetails;
      if (val.classDetails.length === 1) {
        this.classes.controls[i].get('class')?.setValue(val.classDetails[0].standard);
        this.classes.controls[i].get('class')?.disable();
        this.setStrength(i, val.classDetails[0]);
      }
    }
  }

  /**
   * Function to set strength
   * @param i
   * @param val
   */
  setStrength(i: any, val: any) {
    this.resetclassInfo('standard', i);

    if (val) {
      this.subjectDropdownOptions[i] = this.filterSubjects(val.standard,this.currentSubjects[i]).map((s: any) => ({ ...s, displayName: this.translateService.instant(s._id, { board: this.classes.controls[i].get('board')?.value }) }))
      if (this.subjectDropdownOptions[i].length === 1) {
        const subject = this.subjectDropdownOptions[i][0];
        this.classes.controls[i].get('subject')?.setValue(subject._id);
        this.classes.controls[i].get('subject')?.disable();
        this.subjectMapper(i, subject);
      }
      this.resetclassInfo('strength', i);
      this.classes.controls[i].get('boysStrength')?.setValue(val.boysStrength);
      this.classes.controls[i]
        .get('girlsStrength')
        ?.setValue(val.girlsStrength);
    } else {
      this.resetclassInfo('strength', i);
    }
  }

  /**
   * Function to reset class info
   * @param type
   * @param i
   */
  resetclassInfo(type: any, i: any) {
    if (type === 'board') {
      this.classes.controls[i].get('medium')?.reset({ value: null, disabled: false });
      this.classes.controls[i].get('class')?.reset({ value: null, disabled: false });
      this.classes.controls[i].get('subject')?.reset({ value: null, disabled: false });
      this.classes.controls[i].get('subjectDetails')?.reset();
      this.classDropdownOptions[i] = [];
      this.mediumDropdownOptions[i] = [];
      this.subjectDropdownOptions[i] = [];
    } else if (type === 'medium') {
      this.classes.controls[i].get('class')?.reset({ value: null, disabled: false });
      this.classes.controls[i].get('subject')?.reset({ value: null, disabled: false });
      this.classes.controls[i].get('subjectDetails')?.reset();
      this.classDropdownOptions[i] = [];
      this.subjectDropdownOptions[i] = [];
    }
    else if (type === 'standard') {
      this.subjectDropdownOptions[i] = [];
      this.classes.controls[i].get('subject')?.reset({ value: null, disabled: false });
      this.classes.controls[i].get('subjectDetails')?.reset();
    }
    this.classes.controls[i].get('boysStrength')?.reset();
    this.classes.controls[i].get('girlsStrength')?.reset();
  }

  /**
   * Function to get profile info
   */
  setProfileInfo(val:any) {
    this.userData = val.data;
    if (!this.isTeacher) return;

    const teacherProfile = val?.data?.profiles?.teacher;
    const schoolFacilities = val.data.school.facilities;
    this.mergeSchoolResource(schoolFacilities);

    const keysToRemove = ['classes', 'facilities'];

    const { newObj, removedObj } = this.utilityService.removeKeys(
      teacherProfile,
      keysToRemove
    );
    this.patchObj = newObj;
    this.dependentPatchData = removedObj;
    this.dependentPatchData.classes.sort((a:any, b:any) => a.board.localeCompare(b.board) || a.class - b.class || a.subject.localeCompare(b.subject) || a.medium.localeCompare(b.medium));

    if (
      this.dependentPatchData.classes &&
      this.dependentPatchData.classes.length > 0
    ) {
      for (let data of this.dependentPatchData.classes) {
        if (data) {
          this.addNewclasses('edit');
        }
      }
      this.patchClasses();
    } else {
      this.addNewclasses('add');
    }

    if (
      this.dependentPatchData.facilities &&
      this.dependentPatchData.facilities.length > 0
    ) {
      this.resourceTypeDropdownOptions = this.resourceMasterData;
      for (
        let i = 0;
        i < this.dependentPatchData.facilities.length - 1;
        i++
      ) {
        this.addResource();
      }
      this.patchResourceDropdown();
    }
  }

  /**
   * Function to create user profile form
   */
  createUserForm() {
    this.userPorfileForm = this.fb.group({
      classes: this.fb.array([]),
      facilities: this.fb.array([]),
    });
    if (this.isTeacher) this.addResource();
  }

  /**
   * Function to get resource data
   */
  setResourceData(val: any) {
    this.resourceTypeDropdownOptions = val.data.results;
    this.resourceMasterData = val.data.results;
  }

  mergeSchoolResource(schoolResource:any){
    const schoolOthers = schoolResource.filter((ele:any)=> ele.type =='Others').map((item:any)=> 
      {
      return {
        type: item.otherType,
        facilities: item.details,
        otherType: null,
        typeChipSet: item.typeChipSet,
        detailsChipSet: item.detailsChipSet
      }
    }
    )
    this.resourceTypeDropdownOptions.push(...schoolOthers)

    const otherObj = {
      type: 'Others',
    };
    this.resourceTypeDropdownOptions.push(otherObj);
  }

  /**
   * Function to set resouce details options
   * @param i
   * @param val
   */
  setResourceDetailsValues(i: any, val: any) {
    const facilityControl = this.facilities.controls[i];
    this.utilityService.setResourceDetailsValue(
      facilityControl,
      this.resourceDetailsDropdownOptions,
      i,
      val
    );
  }

  subjectMapper(i:any, val:any){
    if (val) {
      let mapSubjects = val.subjects.sort((a:any,b:any)=> a.sem - b.sem)
      this.classes.controls[i].get('subjectDetails')?.setValue(mapSubjects);
    }
  }

  filterSubjects(standard:any,subjects:any[]){
    return subjects.filter((e)=> {
      if(e?.subjects[0]?.applicableClasses?.length){
        return e.subjects[0].applicableClasses.includes(standard)
      }else{
        return e
      }
    })
  }


  setSubjectDropdown(i:any,val:any,standard:any){
    if (val) {
      this.subjectDropdownOptions[i] = this.filterSubjects(standard,val.subjects).map((s: any) => ({ ...s, displayName: this.translateService.instant(s._id, { board: this.classes.controls[i].get('board')?.value }) }));
      if (this.subjectDropdownOptions[i].length === 1) {
        const subject = this.subjectDropdownOptions[i][0];
        this.classes.controls[i].get('subject')?.setValue(subject._id);
        this.classes.controls[i].get('subject')?.disable();
        this.subjectMapper(i, subject);
      }
    }
  }
  /**
   * Function to patch class data
   */
  patchClasses() {
    for (let i = 0; i < this.dependentPatchData.classes.length; i++) {
      this.classes.controls[i]
        ?.get('board')
        ?.setValue(this.dependentPatchData.classes[i].board);
      if (this.boardDropdownOptions.length === 1) {
        this.classes.controls[i].get('board')?.disable();
      }
      const mediums = this.boardMasterData.filter(
        (e: any) => e._id === this.dependentPatchData.classes[i].board
      );
      this.setMediumSubjectDropdown(i, mediums[0]);
      this.classes.controls[i]
        ?.get('medium')
        ?.setValue(this.dependentPatchData.classes[i].medium);
      if (!mediums[0]?.medium) {
        console.warn(
          `Orphaned class: board "${this.dependentPatchData.classes[i].board}" not found in master data`,
          this.dependentPatchData.classes[i]
        );
      }
      const classes = (mediums[0]?.medium ?? []).filter(
        (e: any) => e.medium === this.dependentPatchData.classes[i].medium
      );
      this.setClassDropdown(i, classes[0]);
      this.setSubjectDropdown(i,mediums[0],this.dependentPatchData.classes[i].class)
      this.classes.controls[i]
        ?.get('class')
        ?.setValue(this.dependentPatchData.classes[i].class);
      this.classes.controls[i]
        ?.get('subject')
        ?.setValue(this.dependentPatchData.classes[i].subject);
      this.classes.controls[i]
        ?.get('boysStrength')
        ?.setValue(this.dependentPatchData.classes[i].boysStrength);
      this.classes.controls[i]
        ?.get('girlsStrength')
        ?.setValue(this.dependentPatchData.classes[i].girlsStrength);
      this.classes.controls[i]
        ?.get('subjectDetails')
        ?.setValue(this.dependentPatchData.classes[i].subjectDetails);
    }
  }

  /**
   * Function to patch resource data
   */
  patchResourceDropdown() {
    if (this.dependentPatchData.facilities.length) {
      for (let i = 0; i < this.facilities.length; i++) {
        this.facilities.controls[i]
          .get('type')
          ?.setValue(this.dependentPatchData.facilities[i]?.type);
        this.facilities.controls[i]
          .get('typeChipSet')
          ?.setValue(this.dependentPatchData.facilities[i]?.typeChipSet);
        this.facilities.controls[i]
          .get('detailsChipSet')
          ?.setValue(this.dependentPatchData.facilities[i]?.typeChipSet);

        if (this.dependentPatchData.facilities[i]?.typeChipSet) {
          const valueForDetails = this.utilityService.filterDropdownValues(
            this.resourceMasterData,
            'type',
            this.dependentPatchData.facilities[i].type
          );
          this.resourceDetailsDropdownOptions[i] = [
            ...valueForDetails.facilities,
          ];
        }
        this.facilities.controls[i]
          .get('otherType')
          ?.setValue(this.dependentPatchData.facilities[i].otherType);
        this.facilities.controls[i]
          .get('details')
          ?.setValue(this.updatedDetailsMapper(this.dependentPatchData.facilities[i].otherType,this.dependentPatchData.facilities[i].details,i));
        if (this.dependentPatchData.facilities[i].otherType) {
          this.facilities.controls[i]
            .get('otherType')
            ?.addValidators(Validators.required);
          this.facilities.controls[i]
            .get('otherType')
            ?.updateValueAndValidity();
        }
        this.facilities.controls[i]
          .get('details')
          ?.setValidators(Validators.required);
        this.facilities.controls[i].get('details')?.updateValueAndValidity();
      }
    }
  }

  updatedDetailsMapper(type:any,userFacilityDetailsValue:any[],i:any){
    if(type === null){
      return userFacilityDetailsValue.filter((item)=>this.resourceDetailsDropdownOptions[i].includes(item))
    }else{
      return userFacilityDetailsValue
    }
  }

  /**
   * Function called on language change
   * @param lang
   */
  languageChanged(lang: any) {
    this.service.updatePreferedLanguage(lang).
      subscribe({
      next:(res)=>{
          this.loggedInUser.preferredLanguage = lang;
          this.utilityService.handleResponse(res);
          localStorage.setItem('userData', JSON.stringify(this.loggedInUser));
          this.translateService.use(lang);
        },
      error:(err)=>{
          this.utilityService.handleError(err)
        }
      })

  }

  /**
   * getter for formcontrol
   */
  get f(): any {
    return this.userPorfileForm.controls;
  }

  /**
   * Function to convert control to form control
   * @param absCtrl
   * @returns
   */
  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    return absCtrl as FormControl;
  }

  /**
   * gives the formArray of the respected group Name
   * @param groupName
   * @returns
   */
  getFormArray(groupName: string): FormArray {
    return this.userPorfileForm.get(groupName) as FormArray;
  }

  /**
   * getter for classes
   */
  get classes() {
    return this.userPorfileForm.get('classes') as FormArray;
  }

  /**
   * getter for facilities
   */
  get facilities() {
    return this.userPorfileForm.get('facilities') as FormArray;
  }

  /**
   * Function to add new classes controls
   */
  addNewclasses(mode: any) {
    this.mediumDropdownOptions.push([]);
    this.classDropdownOptions.push([]);
    this.subjectDropdownOptions.push([]);
    this.classes.push(
      this.fb.group({
        board: [null, [Validators.required]],
        medium: [null, [Validators.required]],
        class: [null, [Validators.required]],
        subject: [null, [Validators.required]],
        boysStrength: null,
        girlsStrength: null,
        subjectDetails:[null, [Validators.required]]
      })
    );
    if (mode === 'add') {
      this.defaultPreset();
    }
  }

  /**
   * Function to set default preset value for one board or medium
   */
  defaultPreset() {
    if (this.defaultBoard) {
      const i = this.classes.length - 1;
      this.boardDropdownOptions = this.boardMasterData;
      this.classes.controls[i].get('board')?.setValue(this.defaultBoard);
      this.classes.controls[i].get('board')?.disable();
      this.setMediumSubjectDropdown(i, this.boardMasterData[0]);
    }
  }

  /**
   * Function to delete class
   */
  deleteclass(i: any) {
    this.classes.removeAt(i);
  }

  /**
   * Function to add resource control
   */
  addResource() {
    this.resourceDetailsDropdownOptions.push([]);

    this.facilities.push(
      this.fb.group({
        type: [null],
        details: [[]],
        otherType: [],
        typeChipSet: [true],
        detailsChipSet: [true],
      })
    );
  }

  /**
   * Function to remove resource control
   * @param index
   */
  removeResource(index: any) {
    this.facilities.removeAt(index);
  }

  /**
   * get the image data from the file input and append the profile photo to the imageElement and remove the padding given to the parent
   * @param image_upload
   * @param imageEle
   */
  onImageSelect(image_upload: HTMLInputElement) {
    if (image_upload.files) {
      const image = image_upload.files[0];
      const allowedTypes = ['image/png', 'image/jpeg'];
      if (!allowedTypes.includes(image.type)) {
        this.utilityService.showError('Invalid file type. Only PNG, JPG, and JPEG images are allowed.')
        return;
      }
      if (image.size > 5 * 1024 * 1024) {
        this.utilityService.showError('File size exceeds 5MB limit')
        return;
      }

      this.service.uploadProfileImage(image).
        subscribe({
        next:(res)=>{
            this.loggedInUser.profileImage = res?.data?.profileImage;
            localStorage.setItem('userData', JSON.stringify(this.loggedInUser));
            // this.sidebarService.profileImg.set(res?.data?.profileImage);
            const localImageUrl = URL.createObjectURL(image);
            this.sidebarService.profileImg.set(localImageUrl);
            this.utilityService.handleResponse(res);
          },
        error:(err)=>{
            this.utilityService.handleError(err)
          }
        })

    }
  }

  /**
   * set the default image to the profile photo by setting the new image src and add the padding
   * @param display_image
   */
  removeDP() {
    this.service.removeProfileImage().
      subscribe({
      next:(res)=>{
          this.loggedInUser.profileImage = res?.data?.profileImage;
          localStorage.setItem('userData', JSON.stringify(this.loggedInUser));
          this.sidebarService.profileImg.set(res?.data?.profileImage);
          this.utilityService.handleResponse(res);
        },
      error:(err)=>{
          this.utilityService.handleError(err);
        }
      })
  }

  /**
   * Function to split classes
   * @param classes 
   * @returns 
   */
  splitClasses(classes:any[]) {
    const result:any[] = [];
    classes.forEach(obj => {
      const subjectName = obj.subject;
      const { subjectDetails } = obj;
        subjectDetails.forEach((detail:any) => {
        result.push({
          ...obj,
          subject: detail.subjectName,
              sem:detail.sem,
              name:subjectName
        });
      });
    });
    result.forEach((ele:any)=>{
      delete ele.subjectDetails
      if (ele.boysStrength == null) delete ele.boysStrength
      if (ele.girlsStrength == null) delete ele.girlsStrength
    })
    return result;
  }

  /**
   * save the profile info and redirect the user to the home page
   */
  onSave() {
    this.submitted = true;

    if (this.classes.controls.length === 0) {
      return;
    }
    if (this.userPorfileForm.invalid) {
      return;
    }

    const classDetails = this.splitClasses(this.classes.getRawValue());

    if(this.utilityService.hasDuplicates(classDetails)){
      this.utilityService.showWarning('Duplicate class-subject mapping found. Please verify.');
      return
    }

    const data = this.userPorfileForm.getRawValue();
    data.facilities = this.utilityService.removeObjectsWithEmptyType(
      data.facilities
    );

    data.classes = classDetails;

    this.service.updateProfile(data).subscribe({
      next: (res) => {
        this.utilityService.handleResponse(res);
        this.loggedInUser.profiles.teacher = res.data.profiles.teacher;
        localStorage.setItem('userData', JSON.stringify(this.loggedInUser));
      },
      error: (err) => {
        this.utilityService.handleError(err);
      },
    });
  }

  openConfirmPopupforDeleteClass(i:any){
    this.selectedClassIndex = i;
    this.showDeleteClassDetailsConfirm = true;
  }

  closeDeleteClass(value: string) {
    if (value === 'delete') {
      this.deleteclass(this.selectedClassIndex);
    }
    this.showDeleteClassDetailsConfirm = false;
  }

  openConfirmPopupforDeleteResource(i:any){
    this.selectedResIndex = i;
    this.showDeleteResourceConfirm = true;
  }

  closeDeleteResource(value: string) {
    if (value === 'delete') {
      this.removeResource(this.selectedResIndex);
    }
    this.showDeleteResourceConfirm = false;
  }

  closeDeleteProfileImage(value:string){
    if(value === 'delete'){
      this.removeDP()
    }
    this.showDeleteProfileImageConfirm = false;
  }

  ngOnDestroy(): void {
    const profileUrl = this.utilityService.loggedInUserData?.profileImage || '';
    this.sidebarService.profileImg.set(profileUrl)
  }
}
