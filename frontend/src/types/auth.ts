import type { Session as ToolpadSession } from '@toolpad/core';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface AppSession extends ToolpadSession {
  user: AppUser;
}