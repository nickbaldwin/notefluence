export enum CellType {
  MARKDOWN = 'MARKDOWN',
  CODE = 'CODE',
  OUTPUT = 'OUTPUT',
  IMAGE = 'IMAGE',
  CHART = 'CHART',
}

export interface Cell {
  id: string;
  type: CellType;
  content: string;
  output?: any;
  metadata?: Record<string, any>;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: Cell[];
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  parentId?: string;
  children?: Page[];
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
  pages?: Page[];
  pageCount?: number;
  memberCount?: number;
}

export interface Activity {
  id: string;
  type: string;
  projectId?: string;
  pageId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}
