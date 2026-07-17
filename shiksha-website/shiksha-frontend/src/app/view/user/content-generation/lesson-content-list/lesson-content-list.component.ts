import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import { ContentGenerationService } from '../content-generation.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Subject, Subscription, catchError, debounceTime, distinctUntilChanged, of } from 'rxjs';
interface ListParams {
  currentPage: number;
  pageSize: number;
  selectedType?: string;
  selectedBoard?: string;
  selectedMedium?: string;
  selectedClass?: string;
  selectedSubject?: string;
  searchTerm?: string;
  selectedMonth?: string,
  presentationMonth?: string,
  isCompleted?:string,
  isGenerated?:string,
  presentationStatus?: string
}

interface PresentationListItem {
  id: string;
  creation_time: string;
  textbook_file: string;
  slides: number | null;
  instruction: string | null;
  status: string;
  message: string;
  metadata: any;
}

@Component({
  selector: 'app-lesson-content-list',
  templateUrl: './lesson-content-list.component.html',
  styleUrls: ['./lesson-content-list.component.scss']
})
export class LessonContentListComponent implements OnInit, AfterViewInit, OnDestroy {
  currentPage = 1;
  pageSize = 6;
  totalItems = 0;
  tableHeaders = ['Date', 'Class', 'Subject', 'Type', 'Chapter', 'Sub Topics', 'Action'];

  typeDropdownOptions: any[] = [{ name: 'Lesson Plan', value: 'lesson' }, { name: 'Resource Plan', value: 'resource' }, { name: 'Presentation', value: 'presentation' }, { name: 'All', value: 'all' }];
  boardDropdownOptions: any[] = [];
  mediumDropdownOptions: any[] = [];
  classDropdownOptions: any[] = [];
  subjectDropdownOptions: any[] = [];
  statusDropdownOptions: any[] = [{name:'Saved Plans',value:'true'},{name:'Drafted Plans',value:'false'},{name:'All',value:'all'}];

  showFilterPopUp: boolean = false;

  typeDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Type',
    height: 'auto',
    bindLabel: 'name',
    bindValue: 'value',
    clearableOff :true,
    labelTxt:'Plan Type'
  };
  boardDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Board',
    height: 'auto',
    bindLabel: 'board',
    bindValue: 'board',
    labelTxt:'Board'
  };
  mediumDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Medium',
    height: 'auto',
    bindLabel: 'medium',
    bindValue: 'medium',
    labelTxt:'Medium'
  };
  classDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Class',
    height: 'auto',
    bindLabel: 'class',
    bindValue: 'class',
    labelTxt:'Class'
  };
  subjectDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Subject',
    height: 'auto',
    bindLabel: 'displayName',
    bindValue: 'subject',
    labelTxt:'Subject'
  };

  statusDropdownconfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Plan Status',
    height: 'auto',
    bindLabel: 'name',
    bindValue: 'value',
    clearableOff:true,
    labelTxt:'Plan Status'
  };


  list: any[] = [];
  classes!: any[];
  selectedType: string = "all";
  selectedBoard!: any;
  selectedMedium!: any;
  selectedClass!: any;
  selectedSubject!: any;
  selectedMonth!: any;
  searchText!: string;
  private searchTerms = new Subject<string>();
  classList: any[] = []
  isCompleted:any = '';
  private searchSubscription!: Subscription;
  private listSubscription = new Subscription();


  @ViewChild('typeDropDown') typedropdown: any;
  @ViewChild('boardDropDown') boarddropdown: any;
  @ViewChild('mediumDropDown') mediumdropdown: any;
  @ViewChild('classDropDown') classdropdown: any;
  @ViewChild('subjectDropDown') subjectdropdown: any;
  @ViewChild('statusDropDown') statusDropDown: any;

  private getListParams(): ListParams {
    const formattedMonth = this.selectedMonth ? this.selectedMonth.split('-')[1] : null;

    return {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      selectedType: this.selectedType,
      selectedBoard: this.selectedBoard,
      selectedMedium: this.selectedMedium,
      selectedClass: this.selectedClass,
      selectedSubject: this.selectedSubject,
      selectedMonth: formattedMonth,
      presentationMonth: this.selectedMonth,
      searchTerm: this.searchText,
      isCompleted:this.isCompleted,
      isGenerated:'false',
      presentationStatus: 'complete',
    };
  }

  constructor(private contentGenService: ContentGenerationService, private router: Router, public utilityservice: UtilityService) {}

  ngOnInit(): void {
    const data: string = localStorage.getItem('userData') ?? '';
    const loggedInUser = JSON.parse(data);
    this.boardDropdownOptions = this.utilityservice.formatResponse(loggedInUser.classes);

    if (this.boardDropdownOptions.length === 1) {
      this.selectedBoard = this.boardDropdownOptions[0].board;
      this.mediumDropdownOptions = this.filterMediumByBoard(this.boardDropdownOptions, this.selectedBoard)[0].mediums;
    }

    if (this.mediumDropdownOptions.length === 1) {
      this.selectedMedium = this.mediumDropdownOptions[0].medium;
      this.classDropdownOptions = this.filterClassByMedium(this.mediumDropdownOptions, this.selectedMedium)[0].classes?.sort((a:any,b:any)=>a.class-b.class);
    }

    if (this.classDropdownOptions.length === 1) {
      this.selectedClass = this.classDropdownOptions[0].class;
      const subjectDropdownValue = this.filterSubjectByClass(this.classDropdownOptions, this.selectedClass)[0].data;
      this.subjectDropdownOptions = this.utilityservice.formatSubjectDropdown(subjectDropdownValue);
    }

    if (this.subjectDropdownOptions.length === 1) {
      this.selectedSubject = this.subjectDropdownOptions[0].subject;
    }

    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    this.selectedMonth = `${year}-${month}`;
    this.getAllList(this.getListParams());

   this.searchSubscription = this.searchTerms.pipe(
      debounceTime(1000), // Adjust the debounce time as needed
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchText = searchTerm;
      const params = this.getListParams();
      this.getAllList(params);
    });
  }

  ngAfterViewInit(): void {
    if (this.typedropdown) this.typedropdown.selectedItem = this.selectedType;
    if (this.statusDropDown) this.statusDropDown.selectedItem = 'all';
    if (this.boarddropdown) this.boarddropdown.selectedItem = this.selectedBoard ?? null;
    if (this.mediumdropdown) this.mediumdropdown.selectedItem = this.selectedMedium ?? null;
    if (this.classdropdown) this.classdropdown.selectedItem = this.selectedClass ?? null;
    if (this.subjectdropdown) this.subjectdropdown.selectedItem = this.selectedSubject ?? null;
  }

  filterMediumByBoard(dropdownValue:any,selecteItem:any){
    
    
    
    return dropdownValue.filter((item:any)=>item.board === selecteItem);
  }

  filterClassByMedium(dropdownValue:any,selecteItem:any){
 
    
    return dropdownValue.filter((item:any)=>item.medium === selecteItem);
  }

  filterSubjectByClass(dropdownValue:any,selecteItem:any){
    return dropdownValue.filter((item:any)=>item.class === selecteItem);
  }

  onTypeChange(val: any) {
    this.currentPage = 1;
    this.selectedType = val;
    // this.boarddropdown.selectedItem = null;
    // this.selectedBoard = null;
    // this.selectedMonth = null;
    // this.searchText = '';
    // this.resetBoardChange();
    const params = this.getListParams();
    this.getAllList(params);
  }

  onBoardChange(val: any) {
    this.currentPage = 1;
    this.selectedBoard = val;
    this.resetBoardChange();
    if (val) {
      const mediumFilter = this.boardDropdownOptions.filter(item => item.board === this.selectedBoard);
      this.mediumDropdownOptions = mediumFilter[0].mediums;      
    }
    const params = this.getListParams();
    this.getAllList(params);
  }

  resetBoardChange() {
    if (this.mediumdropdown) this.mediumdropdown.selectedItem = null;
    this.selectedMedium = null;
    if (this.classdropdown) this.classdropdown.selectedItem = null;
    this.selectedClass = null;
    if (this.subjectdropdown) this.subjectdropdown.selectedItem = null;
    this.selectedSubject = null;
    this.mediumDropdownOptions = [];
    this.classDropdownOptions = [];
    this.subjectDropdownOptions = [];
  }

  onMediumChange(val: any) {
    this.currentPage = 1;
    this.selectedMedium = val;
    this.resetMediumChange();
    if (val) {
      const classFilter = this.mediumDropdownOptions.filter(item => item.medium === this.selectedMedium);
      this.classDropdownOptions = classFilter[0].classes?.sort((a:any,b:any)=>a.class-b.class)    
    }
    const params = this.getListParams();
    this.getAllList(params);
  }

  resetMediumChange() {
    if (this.classdropdown) this.classdropdown.selectedItem = null;
    this.selectedClass = null;
    if (this.subjectdropdown) this.subjectdropdown.selectedItem = null;
    this.selectedSubject = null;
    this.classDropdownOptions = [];
    this.subjectDropdownOptions = [];
  }

  resetClassChange() {
    if (this.subjectdropdown) this.subjectdropdown.selectedItem = null;
    this.selectedSubject = null;
    this.subjectDropdownOptions = [];
  }

  onClassChange(val: any) {
    this.currentPage = 1;
    this.selectedClass = val;
    this.resetClassChange();
    if (val) {
      const subjectFilter = this.classDropdownOptions.filter(item => item.class === this.selectedClass);
      this.subjectDropdownOptions = this.utilityservice.formatSubjectDropdown(subjectFilter[0].data);     
    }
    const params = this.getListParams();
    this.getAllList(params);
  }

  onSubjectChange(val: any) {
    this.currentPage = 1;
    this.selectedSubject = val;

    const params = this.getListParams();
    this.getAllList(params);
  }

  onMonthSelection(event: any) {
    this.currentPage = 1;
    this.selectedMonth = event.target.value;

    const params = this.getListParams();
    this.getAllList(params);
  }

  onStatusChange(val:any) {
    if(val === 'all'){
      this.isCompleted='';
    }else{
      this.isCompleted=val;
    }
    this.currentPage = 1;
    const params = this.getListParams();
    this.getAllList(params);
  }

  getAllList(params: ListParams) {
    const lessonListRequest = params.selectedType === 'presentation' ? of({ data: [] }) : this.contentGenService.getAllList(params);
    const presentationListRequest = (params.selectedType === 'all' || params.selectedType === 'presentation') ? this.contentGenService.getPresentationJobs(params) : of([]);
    let lessonList: any[] = [];
    let presentationList: any[] = [];
    const render = () => {
      const nextList = [...lessonList, ...presentationList].sort((a: any, b: any) => this.getItemTimestamp(b) - this.getItemTimestamp(a));
      if (this.getListSignature(this.list) !== this.getListSignature(nextList)) {
        this.list = nextList;
        this.totalItems = nextList.length;
      }
    };

    this.listSubscription.unsubscribe();
    this.listSubscription = new Subscription();
    this.listSubscription.add(lessonListRequest.pipe(catchError(_ => of(null))).subscribe(res => {
      lessonList = Array.isArray(res?.data) ? res.data : [];
      render();
    }));
    this.listSubscription.add(presentationListRequest.pipe(catchError(_ => of(null))).subscribe(res => {
      presentationList = this.filterPresentationJobs(Array.isArray(res) ? res : [], params)
        .map((item: PresentationListItem) => this.mapPresentationJob(item));
      render();
    }));
  }

  getBoardsList(userDetails: any) {
    let classList = [];
    classList = this.utilityservice.formatResponse(userDetails.classes);

    this.boardDropdownOptions = classList;
    if(this.boardDropdownOptions.length === 1){
      console.log(this.boardDropdownOptions[0].board);
      
      this.boarddropdown.selectedItem = this.boardDropdownOptions[0].board;
    }

  }

  onView(data: any) {
    if (data.isPresentation) {
      this.router.navigate([`/content-generation/presentation/${data.id}`]);
      return;
    }
    if (data.isLesson) {
      this.router.navigate([`/content-generation/lesson-plan/${data.lesson._id}`]);
    }
    else {

      this.router.navigate([`/content-generation/resource-plan/${data.resource._id}`]);
    }
  }

  onViewDraft(data:any){
    if (data.isPresentation) {
      this.router.navigate([`/content-generation/presentation/${data.id}`]);
      return;
    }
    if (data.isLesson) {
      this.router.navigate([`/content-generation/lesson-plan/draft/${data.lesson._id}`]);
    }
    else {

      this.router.navigate([`/content-generation/resource-plan/draft/${data.resource._id}`]);
    }
  }

  searchInputChanged(e: any) {
    this.searchTerms.next(e.target.value);
  }

  /**
  * pagination
  */

  onPageChange(page: number): void {
    this.currentPage = page;
    const params = this.getListParams();
    this.getAllList(params);
  }

  retry(_id:any,regeneratedId:any){
    const obj = {
      _id,
      regeneratedId
    }

    this.contentGenService.retry(obj).
    subscribe({
      next:(res)=>{
        this.utilityservice.handleResponse(res);
        const param = this.getListParams();
        this.getAllList(param);
      },
      error:(err)=>{
        this.utilityservice.handleError(err);
      }
    })
  }

  chat(recordId:any, chapterId:any){
    this.router.navigate(['/content-generation/lesson-chat'],{queryParams:{recordId,chapterId}})
  }

  showDeletePopup = false;
  deleteHeading = '';
  private itemPendingDelete: any;

  onDelete(item: any) {
    this.itemPendingDelete = item;
    this.deleteHeading = item.isLesson ? 'Delete Lesson Plan' : 'Delete Lesson Resource';
    this.showDeletePopup = true;
  }

  confirmDelete(action: string) {
    this.showDeletePopup = false;
    const item = this.itemPendingDelete;
    this.itemPendingDelete = null;
    if (action !== 'delete' || !item) return;

    const id = item.isLesson ? item.lesson._id : item.resource._id;
    const request = item.isLesson
      ? this.contentGenService.deleteLessonPlan(id)
      : this.contentGenService.deleteResourcePlan(id);

    request.subscribe({
      next: (res) => {
        this.utilityservice.handleResponse(res);
        this.getAllList(this.getListParams());
      },
      error: (err) => this.utilityservice.handleError(err),
    });
  }

  private filterPresentationJobs(list: PresentationListItem[], params: ListParams): PresentationListItem[] {
    let filteredList = list.filter(item => item.status === 'complete');

    if (params.searchTerm) {
      const searchTerm = params.searchTerm.toLowerCase();
      filteredList = filteredList.filter(item => {
        const title = item.metadata?.plan?.outline?.title || '';
        return [title, item.message, item.textbook_file].some(value => String(value).toLowerCase().includes(searchTerm));
      });
    }

    return filteredList;
  }

  private mapPresentationJob(item: PresentationListItem) {
    const totalSlides = item.metadata?.quality?.total_slides || item.metadata?.plan?.outline?.total_slides || item.slides;
    return {
      ...item,
      isPresentation: true,
      isCompleted: item.status === 'complete',
      updatedAt: item.creation_time,
      presentationTitle: item.metadata?.plan?.outline?.title || 'Presentation deck',
      presentationStatusTone: item.status === 'complete' ? 'completed' : item.status === 'error' ? 'failed' : item.status === 'idle' ? 'idle' : 'running',
      presentationStatusLabel: item.status === 'complete' ? 'Completed' : item.status === 'error' ? 'Error' : item.status === 'idle' ? 'Idle' : 'In Progress',
      presentationStatusMessage: item.message || 'Presentation job created',
      presentationSlideCount: totalSlides,
    };
  }

  private getItemTimestamp(item: any): number {
    return new Date(item.updatedAt || item.regeneratedupdatedAt || item.regeneratedcreatedAt || item.creation_time || 0).getTime();
  }

  private getListSignature(list: any[]): string {
    return JSON.stringify(list.map((item: any) => ({
      id: item.id || item._id,
      status: item.status,
      message: item.message,
      updatedAt: item.updatedAt,
      regeneratedupdatedAt: item.regeneratedupdatedAt,
      regeneratedcreatedAt: item.regeneratedcreatedAt,
      slides: item.presentationSlideCount,
      isCompleted: item.isCompleted,
    })));
  }

  ngOnDestroy(): void {
    this.listSubscription.unsubscribe();
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

}
