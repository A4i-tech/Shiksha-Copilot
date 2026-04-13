export interface ActionMenuPosition {
  top: string;
  left: string;
}

interface ActionMenuOptions {
  menuHeight?: number;
  menuWidth?: number;
  viewportPadding?: number;
  verticalOffset?: number;
}

export class ActionMenuController {
  openStates: boolean[] = [];
  desktopPositions: Record<number, ActionMenuPosition> = {};

  constructor(private readonly options: ActionMenuOptions = {}) {}

  toggleMobileMenu(index: number, event: Event): void {
    event.stopPropagation();

    const wasOpen = !!this.openStates[index];
    this.closeAll();

    if (!wasOpen) {
      this.openStates[index] = true;
    }
  }

  toggleDesktopMenu(index: number, event: Event): void {
    event.stopPropagation();

    const wasOpen = !!this.openStates[index];
    this.closeAll();

    if (wasOpen) {
      return;
    }

    const target = event.currentTarget as HTMLElement | null;
    if (target) {
      this.desktopPositions[index] = this.getDesktopMenuPosition(target);
    }

    this.openStates[index] = true;
  }

  closeAll(): void {
    this.openStates = [];
    this.desktopPositions = {};
  }

  closeAllIfTriggeredInside(event: MouseEvent, containerSelector: string): void {
    if ((event.target as HTMLElement).closest(containerSelector)) {
      this.closeAll();
    }
  }

  private getDesktopMenuPosition(target: HTMLElement): ActionMenuPosition {
    const rect = target.getBoundingClientRect();
    // Keep this estimate in sync with the action-menu templates until the
    // positioning logic is upgraded to measure the rendered menu height.
    const menuWidth = this.options.menuWidth ?? 192;
    const menuHeight = this.options.menuHeight ?? 220;
    const viewportPadding = this.options.viewportPadding ?? 8;
    const verticalOffset = this.options.verticalOffset ?? 4;
    const top =
      rect.bottom + verticalOffset + menuHeight > window.innerHeight
        ? Math.max(viewportPadding, rect.top - menuHeight - verticalOffset)
        : rect.bottom + verticalOffset;
    const left = Math.max(
      viewportPadding,
      Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - viewportPadding)
    );

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  }
}
