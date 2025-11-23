export interface ApiResponse<T = unknown> {
  status: 'success' | 'fail' | 'error';
  message: string;
  error?: string;
  data?: T;
}