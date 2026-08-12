export interface AuditLogList{
    uploadId:string,
    eventType:string,
    createdAt:string,
    logUrl:string | null,
    status:'in_progress' | 'success' | 'failure',
    name:string
}
