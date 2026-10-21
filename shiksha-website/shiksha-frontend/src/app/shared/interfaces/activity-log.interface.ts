export interface ActivityLogPayload {
  moduleName: string;
  idleTime: number;
  interactionTime: number;
  planId: string;
  draftId: string;
  isCompleted: boolean;
}
