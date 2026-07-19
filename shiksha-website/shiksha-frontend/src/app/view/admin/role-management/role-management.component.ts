import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DeleteDetailComponent } from 'src/app/shared/components/delete-detail/delete-detail.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DeleteDetailComponent],
  template: `
    <div class="px-4 pt-4 md:px-0 md:pt-0">
      <h1 class="text-2xl md:text-[30px] font-bold text-content md:leading-[48px]">
        Role Management
      </h1>

      <div class="border text-content rounded my-5 px-4 py-6 md:px-6 md:py-8 bg-white">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-lg font-semibold text-content">Role List</h2>
          <button type="button" class="btn-primary h-9 w-full sm:w-auto px-4" (click)="startCreate()">
            <div class="flex items-center justify-center gap-2">
              <img src="assets/icons/E add.svg" alt="" class="w-4 h-4">
              <span>Add Role</span>
            </div>
          </button>
        </div>

        <form class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6" [formGroup]="form" (ngSubmit)="save()">
          <div>
            <label class="form-control-label">Role Name</label>
            <input #roleNameInput class="form-control h-9" formControlName="name" placeholder="Role name">
          </div>
          <div>
            <label class="form-control-label">Description</label>
            <input class="form-control h-9" formControlName="description" placeholder="Description">
          </div>
          <div>
            <label class="form-control-label">Scope</label>
            <select class="form-control h-9" formControlName="scopeType">
              <option value="" disabled>Select scope</option>
              <option *ngFor="let scopeType of scopeTypes" [value]="scopeType">{{ scopeType }}</option>
            </select>
          </div>

          <div class="md:col-span-3">
            <label class="form-control-label">Permissions</label>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-80 overflow-auto border rounded p-3">
              <label *ngFor="let permission of permissions" class="flex gap-3 items-start text-sm border rounded p-3 bg-surface-muted">
                <input class="mt-1" type="checkbox" [checked]="selectedPermissions.has(permission.name)" [disabled]="editing && editing.isSuperUser" (change)="togglePermission(permission.name, $event)">
                <span>
                  <span class="block font-medium text-content break-all">{{ permission.name }}</span>
                  <span class="block text-xs text-content-60 mt-1">{{ permission.description }}</span>
                </span>
              </label>
            </div>
          </div>

          <div class="md:col-span-3 flex flex-col sm:flex-row justify-end gap-2">
            <button type="button" class="btn-outline-primary h-9 w-full sm:w-20" (click)="reset()">Cancel</button>
            <button type="submit" class="btn-primary h-9 w-full sm:w-20" [disabled]="form.invalid">
              <div class="flex items-center justify-center gap-2">
                <img src="assets/icons/check.svg" alt="" class="w-4 h-4">
                <span>Save</span>
              </div>
            </button>
          </div>
        </form>

        <div class="space-y-4 md:hidden mt-6">
          <div *ngIf="!roles.length" class="text-center text-content-60 py-4 border rounded-xl">No Data Found</div>
          <div *ngFor="let role of roles" class="rounded-xl border p-4 bg-white shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold break-words">{{ role.name }}</p>
                <p class="text-sm text-content-60 mt-1 break-words">{{ role.description }}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-sm shrink-0" [ngClass]="role.isSystem ? 'text-primary bg-primary-30' : 'text-success bg-success-50'">
                {{ role.isSystem ? 'System' : 'Custom' }}
              </span>
            </div>
            <div class="mt-4 flex items-center justify-between gap-3">
              <span class="text-sm text-content-60">{{ role.permissions.length }} permissions</span>
              <span class="text-sm text-content-60">{{ role.scopeType }}</span>
              <div class="flex gap-2">
                <button class="btn-outline-primary h-9 px-3" type="button" (click)="edit(role)">
                  <div class="flex items-center justify-center gap-2">
                    <img src="assets/icons/edit_primary.svg" alt="" class="w-4 h-4">
                    <span>Edit</span>
                  </div>
                </button>
                <button class="btn-danger h-9 px-3" type="button" [disabled]="role.isSuperUser" (click)="openDelete(role)">
                  <div class="flex items-center justify-center gap-2">
                    <img src="assets/icons/delete.svg" alt="" class="w-4 h-4">
                    <span>Delete</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="hidden md:block w-full overflow-x-auto mt-6">
          <table class="table-auto min-w-[900px] w-full border mt-3 rounded-lg" aria-label="role-list">
            <thead>
              <tr class="header font-semibold text-left text-content table-header border-b border-shade">
                <th class="px-4 py-6 border text-sm">Name</th>
                <th class="px-4 py-6 border text-sm">Description</th>
                <th class="px-4 py-6 border text-sm">Type</th>
                <th class="px-4 py-6 border text-sm">Scope</th>
                <th class="px-4 py-6 border text-sm">Permissions</th>
                <th class="px-4 py-6 border text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr *ngFor="let role of roles" class="text-gray-700">
                <td class="px-4 py-6 text-sm border font-medium max-w-[14rem] break-words">{{ role.name }}</td>
                <td class="px-4 py-6 text-sm border max-w-[24rem] break-words">{{ role.description }}</td>
                <td class="p-4 text-sm border whitespace-nowrap">
                  <span class="px-3 py-2 rounded-full" [ngClass]="role.isSystem ? 'text-primary bg-primary-30' : 'text-success bg-success-50'">
                    {{ role.isSystem ? 'System' : 'Custom' }}
                  </span>
                </td>
                <td class="px-4 py-6 text-sm border whitespace-nowrap">{{ role.scopeType }}</td>
                <td class="px-4 py-6 text-sm border whitespace-nowrap">{{ role.permissions.length }}</td>
                <td class="px-4 py-6 text-sm border">
                  <div class="flex items-center justify-center gap-1">
                    <button class="btn-outline-primary h-9 px-3" type="button" (click)="edit(role)">
                      <div class="flex items-center justify-center gap-2">
                        <img src="assets/icons/edit_primary.svg" alt="" class="w-4 h-4">
                        <span>Edit</span>
                      </div>
                    </button>
                    <button class="btn-danger h-9 px-3" type="button" [disabled]="role.isSuperUser" (click)="openDelete(role)">
                      <div class="flex items-center justify-center gap-2">
                        <img src="assets/icons/delete.svg" alt="" class="w-4 h-4">
                        <span>Delete</span>
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!roles.length">
                <td colspan="6" class="text-center text-content-60 py-2">No Data Found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-delete-detail
      *ngIf="roleToDelete"
      [config]="{
        heading: 'Delete Role',
        confirmationText: 'Are you sure you want to delete this role?',
        primaryButtonLabel: 'Delete',
        primaryButtonType: 'delete'
      }"
      (close)="confirmDelete($event)"
    ></app-delete-detail>
  `,
})
export class RoleManagementComponent implements OnInit {
  @ViewChild('roleNameInput') roleNameInput!: ElementRef<HTMLInputElement>;
  roles: any[] = [];
  permissions: any[] = [];
  scopeTypes: string[] = [];
  selectedPermissions = new Set<string>();
  editing: any;
  roleToDelete: any;
  form = this.fb.group({ name: ['', Validators.required], description: [''], scopeType: ['', Validators.required] });
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private fb: FormBuilder, private utility: UtilityService) {}

  ngOnInit(): void { this.load(); }
  load() {
    this.http.get<any>(`${this.baseUrl}/roles`).subscribe((res) => this.roles = res.data.results);
    this.http.get<any>(`${this.baseUrl}/roles/permissions`).subscribe((res) => this.permissions = res.data);
    this.http.get<any>(`${this.baseUrl}/roles/scope-types`).subscribe((res) => this.scopeTypes = res.data);
  }
  startCreate() {
    this.reset();
    this.roleNameInput.nativeElement.focus();
  }
  togglePermission(permission: string, event: Event) {
    (event.target as HTMLInputElement).checked ? this.selectedPermissions.add(permission) : this.selectedPermissions.delete(permission);
  }
  edit(role: any) {
    this.editing = role;
    this.form.patchValue({ name: role.name, description: role.description, scopeType: role.scopeType });
    this.selectedPermissions = new Set(role.permissions);
  }
  reset() {
    this.editing = null;
    this.form.reset({ name: '', description: '', scopeType: '' });
    this.selectedPermissions.clear();
  }
  save() {
    const payload = this.editing?.isSuperUser
      ? { name: this.form.value.name, description: this.form.value.description }
      : { ...this.form.value, permissions: [...this.selectedPermissions] };
    const req$ = this.editing
      ? this.http.put(`${this.baseUrl}/roles/${this.editing._id}`, payload)
      : this.http.post(`${this.baseUrl}/roles`, payload);
    req$.subscribe({
      next: (res: any) => {
        this.utility.handleResponse(res);
        if (this.editing) this.edit({ ...this.editing, ...res.data, permissions: this.editing.isSuperUser ? this.editing.permissions : res.data.permissions });
        else this.reset();
        this.load();
      },
      error: (err) => this.utility.handleError(err),
    });
  }
  openDelete(role: any) {
    this.roleToDelete = role;
  }
  confirmDelete(action: string) {
    if (action !== 'delete') {
      this.roleToDelete = null;
      return;
    }
    this.http.delete(`${this.baseUrl}/roles/${this.roleToDelete._id}`).subscribe({
      next: (res: any) => { this.utility.handleResponse(res); this.roleToDelete = null; this.load(); },
      error: (err) => this.utility.handleError(err),
    });
  }
}
