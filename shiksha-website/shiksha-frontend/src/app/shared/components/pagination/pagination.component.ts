import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface PaginationItem {
  type: 'page' | 'ellipsis';
  page?: number;
  key: string;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  standalone: true,
  imports:[CommonModule]
})
export class PaginationComponent {

  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get desktopItems(): PaginationItem[] {
    return this.buildPaginationItems(1, 1);
  }

  get mobileItems(): PaginationItem[] {
    return this.buildPaginationItems(1, 0);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.pageChange.emit(page);
  }

  getDisplayRange(): string {
    const startRecord = (this.currentPage - 1) * this.pageSize + 1;
    const endRecord = this.currentPage * this.pageSize;
    const adjustedEndRecord = endRecord > this.totalItems ? this.totalItems : endRecord;
    return `${startRecord} - ${adjustedEndRecord}`;
  }

  private buildPaginationItems(boundaryCount: number, siblingCount: number): PaginationItem[] {
    const totalPages = this.totalPages;

    if (totalPages <= 0) {
      return [];
    }

    const startPages = this.range(1, Math.min(boundaryCount, totalPages));
    const endPages = this.range(
      Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
      totalPages
    );

    const siblingsStart = Math.max(
      Math.min(
        this.currentPage - siblingCount,
        totalPages - boundaryCount - siblingCount * 2 - 1
      ),
      boundaryCount + 2
    );

    const siblingsEnd = Math.min(
      Math.max(
        this.currentPage + siblingCount,
        boundaryCount + siblingCount * 2 + 2
      ),
      totalPages - boundaryCount - 1
    );

    const items: PaginationItem[] = startPages.map((page) => this.pageItem(page));

    if (siblingsStart > boundaryCount + 2) {
      items.push(this.ellipsisItem('start'));
    } else if (boundaryCount + 1 < totalPages - boundaryCount) {
      items.push(this.pageItem(boundaryCount + 1));
    }

    this.range(siblingsStart, siblingsEnd).forEach((page) => {
      items.push(this.pageItem(page));
    });

    if (siblingsEnd < totalPages - boundaryCount - 1) {
      items.push(this.ellipsisItem('end'));
    } else if (totalPages - boundaryCount > boundaryCount) {
      items.push(this.pageItem(totalPages - boundaryCount));
    }

    endPages.forEach((page) => {
      if (!items.some((item) => item.type === 'page' && item.page === page)) {
        items.push(this.pageItem(page));
      }
    });

    return items;
  }

  private pageItem(page: number): PaginationItem {
    return { type: 'page', page, key: `page-${page}` };
  }

  private ellipsisItem(position: 'start' | 'end'): PaginationItem {
    return { type: 'ellipsis', key: `${position}-ellipsis` };
  }

  private range(start: number, end: number): number[] {
    if (end < start) {
      return [];
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
}
