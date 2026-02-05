import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface ResumeData {
    id: string;
    title: string;
    content: string;
    user: Principal;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createResume(resumeId: string, title: string, content: string): Promise<void>;
    deleteResume(resumeId: string): Promise<void>;
    duplicateResume(originalResumeId: string, newResumeId: string): Promise<void>;
    getAllResumesForUser(user: Principal): Promise<Array<ResumeData>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getResume(resumeId: string): Promise<ResumeData>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    renameResume(resumeId: string, newTitle: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateResume(resumeId: string, newContent: string, newTitle: string): Promise<void>;
}
