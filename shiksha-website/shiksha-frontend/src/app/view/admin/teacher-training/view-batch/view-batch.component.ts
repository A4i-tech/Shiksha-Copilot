import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Batch, BatchService, Teacher } from 'src/app/view/admin/teacher-training/batch.service';
import { TeacherService } from 'src/app/view/admin/teacher-training/teacher.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, from, concatMap, toArray, finalize } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-view-batch',
  templateUrl: './view-batch.component.html',
  styleUrls: ['./view-batch.component.scss']
})
export class ViewBatchComponent implements OnInit, OnDestroy {
  batches: Batch[] = [];
  private batchesSubscription!: Subscription;
  teacherStats: { totalTeachers: number, trainedTeachers: number, untrainedTeachers: number } | null = null;

  showTeachersPanel = false;
  selectedBatch: Batch | null = null;
  allTeachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  selectedTeachersForAssignment: string[] = [];

  // Pagination properties for Add Participants
  teachersCurrentPage = 1;
  teachersPageSize = 50; // Load more teachers per page
  teachersTotalItems = 0;
  isLoadingTeachers = false;
  isAssigningTeachers = false;

  batchId: string | null = null;

  // Search functionality
  teacherSearchTerm = '';
  searchTimeout: NodeJS.Timeout | null = null;

  canViewAllBatches: boolean = false;

  private route = inject(ActivatedRoute);
  private batchService = inject(BatchService);
  private teacherService = inject(TeacherService);
  private router = inject(Router);
  private utilityService = inject(UtilityService);

  constructor() {
    this.batchId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.fetchBatches(); // Then fetch batches
    this.fetchTeacherStats();
    this.batchesSubscription = this.batchService.batches$.subscribe(batches => {
      this.batches = batches;
    });

    this.loadBatchDetails();

    this.canViewAllBatches = this.utilityService.hasPermission(['scope.global']);
  }

  fetchBatches(): void {
    this.batchService.fetchBatches().subscribe({
      next: (batches: Batch[]) => {
        this.batchService.setBatches(batches);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching batches:', error);
        
        // Handle specific error cases
        if (error.status === 403) {
          console.error('Access denied: You do not have permission to view these batches');
        } else if (error.status === 401) {
          console.error('Authentication required : Please log in again');
        }
        
        // Handle error (e.g., show a toast message)
      }
    });
  }

  fetchTeacherStats(): void {
    this.batchService.getTeacherTrainingStats().subscribe({
      next: (stats) => {
        this.teacherStats = stats;
      },
      error: (error) => {
        console.error('Error fetching teacher stats:', error);
      }
    });
  }

  toggleTeachersPanel(batch: Batch): void {
    if (batch.isSubmitted) {
      console.warn('Cannot add participants to a submitted batch.');
      return;
    }
    const isSameBatch = this.selectedBatch?._id === batch._id;

    if (isSameBatch && this.showTeachersPanel) {
      this.closeAddParticipantsSidebar();
      return;
    }

    this.selectedBatch = batch;
    this.showTeachersPanel = true;
    this.selectedTeachersForAssignment = [];
    this.teacherSearchTerm = '';
    this.teachersCurrentPage = 1;
    this.loadTeachersAndFilter();
  }

  onTeacherSearch(): void {
    // Clear existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    // Debounce search to avoid too many API calls
    this.searchTimeout = setTimeout(() => {
      this.teachersCurrentPage = 1; // Reset to first page when searching
      this.loadTeachersAndFilter();
    }, 3000);
  }

  clearSearch(): void {
    this.teacherSearchTerm = '';
    this.teachersCurrentPage = 1; // Reset to first page when clearing search
    this.loadTeachersAndFilter();
  }

  closeAddParticipantsSidebar(): void {
    this.showTeachersPanel = false;
    this.selectedBatch = null;
    this.selectedTeachersForAssignment = [];
    this.teacherSearchTerm = '';
    this.isAssigningTeachers = false;
  }

  loadTeachersAndFilter(): void {
    this.isLoadingTeachers = true;
    this.teacherService.getTeachers(
      undefined, 
      undefined, 
      this.teachersCurrentPage, 
      this.teachersPageSize,
      this.teacherSearchTerm
    ).subscribe({
      next: (response: unknown) => {
        // Type guard for expected response structure
        const res = response as { success: boolean, data?: { results?: Teacher[], totalItems?: number } };
        this.isLoadingTeachers = false;
        if (res.success && res.data) {
          this.allTeachers = res.data.results || [];
          this.teachersTotalItems = res.data.totalItems || 0;
          this.filterTeachersForSidebar();
        } else {
          this.allTeachers = [];
          this.filteredTeachers = [];
          this.teachersTotalItems = 0;
        }
      },
      error: () => {
        this.isLoadingTeachers = false;
        this.allTeachers = [];
        this.filteredTeachers = [];
        this.teachersTotalItems = 0;
      }
    });
  }

  filterTeachersForSidebar(): void {
    
    const activelyAssignedTeacherIds = new Set<string>();

    // Process all batches to determine which teachers should be filtered out
    this.batches.forEach(batch => {
      if (!batch.isSubmitted) {
        // For unsubmitted batches: All assigned teachers should be filtered out
        batch.assignedTeachers?.forEach(teacher => {
          if (teacher._id) {
            activelyAssignedTeacherIds.add(teacher._id);
          }
        });
      } else {
        // For submitted batches: Only present teachers should be filtered out
        // Absent teachers should re-appear in the available list
        batch.assignedTeachers?.forEach(teacher => {
          if (teacher._id) {
            const isPresent = batch.attendance?.includes(teacher._id) || false;
            if (isPresent) {
              // Teacher was present in submitted batch - filter them out
              activelyAssignedTeacherIds.add(teacher._id);
            } else {
              // Teacher was absent in submitted batch - they should re-appear
            }
          }
        });
      }
    });


    // Filter teachers based on assignment status only (search is handled server-side)
    this.filteredTeachers = this.allTeachers.filter(teacher => {
      // Check if teacher is actively assigned to an unsubmitted batch or present in submitted batch
      if (activelyAssignedTeacherIds.has(teacher._id)) {
        return false;
      }
      return true;
    });

  }

  onTeacherCheckboxChange(batch: Batch, teacher: Teacher, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.selectedTeachersForAssignment.includes(teacher._id!)) {
        this.selectedTeachersForAssignment.push(teacher._id!);
      }
    } else {
      this.selectedTeachersForAssignment = this.selectedTeachersForAssignment.filter(id => id !== teacher._id);
    }
  }

  onDeleteBatch(batchId: string | undefined): void {
    if (!batchId) {
      console.error('Batch ID is undefined. Cannot delete batch.');
      return;
    }

    if (confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      this.batchService.deleteBatch(batchId).subscribe({
        next: () => {
          // Remove the batch from the local array
          this.batches = this.batches.filter(batch => batch._id !== batchId);
          this.batchService.setBatches(this.batches);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting batch:', error);
          
          if (error.status === 403) {
            alert('Access denied. You can only delete batches you created.');
          } else if (error.status === 404) {
            alert('Batch not found.');
          } else {
            alert('Error deleting batch. Please try again.');
          }
        }
      });
    }
  }

  onViewTeachers(batch: Batch): void {
    if (batch._id) {
      // First check if we can access this batch
      this.batchService.getBatchById(batch._id).subscribe({
        next: () => {
          // If we can access the batch, navigate to view teachers
          this.router.navigate(['/training/view-teachers', batch._id]);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error accessing batch:', error);
          
          if (error.status === 403) {
            alert('Access denied. You can only view batches you created.');
          } else if (error.status === 404) {
            alert('Batch not found.');
          } else {
            alert('Error accessing batch details. Please try again.');
          }
        }
      });
    } else {
      console.error('Batch ID is undefined. Cannot navigate to view teachers page.');
    }
  }

  onRemoveAssignedTeacher(batch: Batch, teacher: Teacher): void {
    if (batch.isSubmitted) {
      console.warn('Cannot remove teachers from a submitted batch.');
      return;
    }

    if (!batch._id || !teacher._id) {
      console.error('Batch ID or Teacher ID is missing.');
      return;
    }

    if (confirm(`Are you sure you want to remove ${teacher.identity.name} from ${batch.batchName}?`)) {
      this.batchService.removeTeacherFromBatch(batch._id, teacher._id).subscribe({
        next: (updatedBatch: Batch) => {
          // Update the specific batch in the local array
          const index = this.batches.findIndex(b => b._id === updatedBatch._id);
          if (index !== -1) {
            this.batches[index] = updatedBatch;
            this.selectedBatch = updatedBatch; // Update selected batch if it's the one being viewed
          }
          
          // Re-filter teachers for the 'Add Participants' sidebar to show the removed teacher
          if (this.showTeachersPanel) {
            this.filterTeachersForSidebar();
          }
          
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error removing teacher from batch:', error);
          
          if (error.status === 403) {
            alert('Access denied. You can only remove teachers from batches you created.');
          } else if (error.status === 404) {
            alert('Batch or teacher not found.');
          } else {
            alert('Error removing teacher from batch. Please try again.');
          }
        }
      });
    }
  }

  getTeacherAttendanceStatus(teacherId: string): boolean {
    return this.selectedBatch?.attendance?.includes(teacherId) || false;
  }

  onAttendanceChange(teacherId: string, isPresent: boolean): void {
    if (!this.selectedBatch) {
      console.error('No batch selected for attendance update.');
      return;
    }

    if (this.selectedBatch.isSubmitted) {
      console.warn('Cannot change attendance for a submitted batch.');
      return;
    }

    const batchId = this.selectedBatch._id!;
    let updatedAttendance = [...(this.selectedBatch.attendance || [])];

    if (isPresent) {
      if (!updatedAttendance.includes(teacherId)) {
        updatedAttendance.push(teacherId);
      }
    } else {
      updatedAttendance = updatedAttendance.filter(id => id !== teacherId);
    }

    // Optimistically update the UI
    this.selectedBatch.attendance = updatedAttendance;

    // Call backend service to update attendance for this batch
    this.batchService.updateAttendance(batchId, updatedAttendance).subscribe({
      next: (updatedBatch: Batch) => {
        // Optionally, update the main batches list if attendance changes affect other views
        const index = this.batches.findIndex(b => b._id === updatedBatch._id);
        if (index !== -1) {
          this.batches[index] = updatedBatch;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating attendance:', error);
        // Revert UI if backend update fails, or show an error message
        // You might want to reload batches or specifically revert the checkbox state
      }
    });
  }

  isTeacherAssigned(batch: Batch, teacher: Teacher): boolean {
    return batch.assignedTeachers?.some(t => t._id === teacher._id) || false;
  }

  isTeacherAbsent(batch: Batch, teacher: Teacher): boolean {
    return (batch.assignedTeachers?.some(t => t._id === teacher._id) || false) && 
           !(batch.attendance?.includes(teacher._id!) || false);
  }

  assignSelectedTeachersToBatch(): void {
    if (!this.selectedBatch || this.selectedTeachersForAssignment.length === 0) {
      return;
    }

    if (this.selectedBatch.isSubmitted) {
      console.warn('Cannot assign teachers to a submitted batch.');
      return;
    }

    const batchId = this.selectedBatch._id!;
    const selectedTeacherIds = [...this.selectedTeachersForAssignment];

    this.isAssigningTeachers = true;

    from(selectedTeacherIds).pipe(
      concatMap((teacherId) => this.batchService.assignTeacherToBatch(batchId, teacherId)),
      toArray(),
      finalize(() => {
        this.isAssigningTeachers = false;
      })
    ).subscribe({
      next: (updatedBatches: Batch[]) => {
        const latestUpdatedBatch = updatedBatches[updatedBatches.length - 1];
        if (latestUpdatedBatch) {
          const index = this.batches.findIndex(b => b._id === latestUpdatedBatch._id);
          if (index !== -1) {
            this.batches[index] = latestUpdatedBatch;
          }
          this.selectedBatch = latestUpdatedBatch;
          this.batchService.setBatches([...this.batches]);

          this.selectedTeachersForAssignment = [];
          this.filterTeachersForSidebar();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error assigning teachers to batch:', error);
        
        if (error.status === 403) {
          alert('Access denied. You can only assign teachers to batches you created.');
        } else if (error.status === 404) {
          alert('Batch or teacher not found.');
        } else {
          alert('Error assigning teachers to batch. Please try again.');
        }
      }
    });
  }

  onSaveAndSubmit(batchId: string | undefined): void {
    if (!batchId) {
      console.error('Batch ID is missing.');
      return;
    }

    if (confirm('Are you sure you want to save and submit this batch? Once submitted, it cannot be modified.')) {
      this.batchService.submitBatch(batchId).subscribe({
        next: (updatedBatch: Batch) => {
          // Update the local batches list and selectedBatch to reflect the submitted status
          const index = this.batches.findIndex(b => b._id === updatedBatch._id);
          if (index !== -1) {
            this.batches[index] = updatedBatch;
            this.selectedBatch = updatedBatch; // Update selected batch if it's the one being viewed
          }
          this.batchService.setBatches(this.batches); // Notify other components of the change
          
          // Re-filter teachers to allow absent teachers from submitted batch to re-appear
          if (this.showTeachersPanel) {
            this.filterTeachersForSidebar();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error submitting batch:', error);
          
          if (error.status === 403) {
            alert('Access denied. You can only submit batches you created.');
          } else if (error.status === 404) {
            alert('Batch not found.');
          } else {
            alert('Error submitting batch. Please try again.');
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.batchesSubscription) {
      this.batchesSubscription.unsubscribe();
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  };

  loadBatchDetails(): void {
    // Implementation of loadBatchDetails method
  }

  // Handle pagination for teachers
  onTeachersPageChange(page: number): void {
    this.teachersCurrentPage = page;
    this.loadTeachersAndFilter();
  }

  // Load more teachers (for infinite scroll or load more button)
  loadMoreTeachers(): void {
    if (this.allTeachers.length < this.teachersTotalItems && !this.isLoadingTeachers) {
      this.teachersCurrentPage++;
      this.loadTeachersAndFilter();
    }
  }

  isTeacherSelectedForAssignment(teacher: Teacher): boolean {
    return !!teacher._id && this.selectedTeachersForAssignment.includes(teacher._id);
  }

  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.teachersCurrentPage = 1; // Reset to first page when searching
      this.loadTeachersAndFilter();
    }
  }

} 
