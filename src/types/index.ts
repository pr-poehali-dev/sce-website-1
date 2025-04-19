export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Обычно не хранится в state, только для localStorage
  role: UserRole;
  createdAt: string;
  isEmailVerified: boolean;
  verificationToken?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  RESEARCHER = 'RESEARCHER',
  AGENT = 'AGENT',
  SECURITY = 'SECURITY',
  DOCTOR = 'DOCTOR',
  READER = 'READER'
}

export interface SCEObject {
  id: string;
  number: string;
  name: string;
  classType: SCEClassType;
  description: string;
  containment: string;
  additionalInfo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'pending';
}

export enum SCEClassType {
  SAFE = 'SAFE',
  EUCLID = 'EUCLID',
  KETER = 'KETER',
  THAUMIEL = 'THAUMIEL',
  NEUTRALIZED = 'NEUTRALIZED'
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  category: PostCategory;
  tags: string[];
  status: 'published' | 'draft';
}

export type PostCategory = 'news' | 'report' | 'research' | 'other';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
}

export enum Permission {
  CREATE_OBJECT = 'CREATE_OBJECT',
  EDIT_OBJECT = 'EDIT_OBJECT',
  DELETE_OBJECT = 'DELETE_OBJECT',
  VIEW_OBJECT = 'VIEW_OBJECT',
  CREATE_POST = 'CREATE_POST',
  EDIT_POST = 'EDIT_POST',
  DELETE_POST = 'DELETE_POST',
  VIEW_POST = 'VIEW_POST',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ROLES = 'MANAGE_ROLES'
}
