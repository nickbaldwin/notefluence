export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  joinedAt: Date;
  userId: string;
  projectId: string;
  user?: User;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  slug: string;
  isPublic: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  owner?: User;
  members?: ProjectMember[];
  pages?: Page[];
  pageCount?: number;
  memberCount?: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: any[];
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  parentId?: string;
  parent?: Page;
  children?: Page[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  pageId: string;
  user?: User;
}

export interface File {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  isPublic: boolean;
  createdAt: Date;
  projectId: string;
  uploadedById: string;
  uploadedBy?: User;
}
