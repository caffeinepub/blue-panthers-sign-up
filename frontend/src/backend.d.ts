import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface SignUp {
    id: bigint;
    age: bigint;
    experienceLevel: ExperienceLevel;
    name: string;
    email: string;
    timestamp: Time;
    phone: string;
    position: Position;
}
export interface UserProfile {
    name: string;
}
export enum ExperienceLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export enum Position {
    center = "center",
    guard = "guard",
    forward = "forward"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllSignUps(): Promise<Array<SignUp>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSignUpById(id: bigint): Promise<SignUp>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitSignUp(name: string, email: string, phone: string, age: bigint, position: Position, experienceLevel: ExperienceLevel): Promise<bigint>;
}
