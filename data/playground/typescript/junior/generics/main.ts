interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

function fakeFetch<T>(data: T): Promise<ApiResponse<T>> {
  return new Promise(resolve => setTimeout(() => resolve({ data, status: 200 }), 300));
}

type CreateUser = Omit<User, 'id' | 'createdAt'>;
type UpdateUser = Partial<CreateUser>;
type UserPreview = Pick<User, 'id' | 'name'>;

type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function renderState(state: RequestState<UserPreview[]>): string {
  switch (state.status) {
    case 'idle': return 'Chưa tải';
    case 'loading': return 'Đang tải...';
    case 'success': return 'Người dùng: ' + state.data.map(u => u.name).join(', ');
    case 'error': return 'Lỗi: ' + state.error;
  }
}

const newUser: CreateUser = { name: 'An', email: 'an@vidu.com' };
const patch: UpdateUser = { email: 'an.nguyen@vidu.com' };

console.log(first([10, 20, 30]));
console.log(first(['a', 'b']));
console.log('CreateUser:', newUser, '· UpdateUser:', patch);
console.log(renderState({ status: 'loading' }));

fakeFetch<UserPreview[]>([{ id: 1, name: 'An' }, { id: 2, name: 'Bình' }]).then(res => {
  console.log(renderState({ status: 'success', data: res.data }));
});
