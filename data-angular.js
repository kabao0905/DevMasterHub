// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — Angular Curriculum (Frontend)
// ═══════════════════════════════════════════════════════════════
const DATA_ANGULAR = {
  id:'angular', name:'Angular', icon:'🅰️', color:'#DD0031',
  gradient:'linear-gradient(135deg,#DD0031,#C3002F)',
  category:'frontend',
  description:'Enterprise framework — TypeScript, RxJS, dependency injection',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Angular fundamentals',lessons:[
      {id:'intro',title:'Angular Overview & CLI',
       theory:'<p><b>Angular</b> là full-featured framework của Google. TypeScript-first, opinionated architecture, enterprise-grade.</p><p>Angular CLI tạo project, components, services tự động.</p>',
       code:'// Install Angular CLI\n// npm install -g @angular/cli\n// ng new my-app\n// ng serve\n\n// app.component.ts\nimport { Component } from \'@angular/core\';\n\n@Component({\n  selector: \'app-root\',\n  template: `\n    <h1>{{ title }}</h1>\n    <button (click)="count = count + 1">\n      Clicks: {{ count }}\n    </button>\n  `\n})\nexport class AppComponent {\n  title = \'Hello Angular!\';\n  count = 0;\n}',
       lang:'typescript',
       keyPoints:['TypeScript required','@Component decorator','{{ }} interpolation','() event binding, [] property binding'],
       exercise:'Tạo Angular app mới với Angular CLI'},
      {id:'templates',title:'Templates & Data Binding',
       theory:'<p>Angular templates: interpolation, property binding, event binding, two-way binding.</p>',
       code:'@Component({\n  template: `\n    <!-- Interpolation -->\n    <h1>{{ title }}</h1>\n\n    <!-- Property binding -->\n    <img [src]="imageUrl">\n    <button [disabled]="!isValid">Submit</button>\n\n    <!-- Event binding -->\n    <button (click)="onClick($event)">Click</button>\n\n    <!-- Two-way binding -->\n    <input [(ngModel)]="name">\n    <p *ngIf="name">Hello, {{ name }}!</p>\n\n    <!-- Iteration -->\n    <ul>\n      <li *ngFor="let item of items; let i = index">\n        {{ i + 1 }}. {{ item.name }}\n      </li>\n    </ul>\n  `\n})',
       lang:'typescript',
       keyPoints:['[prop] = property binding','(event) = event binding','[(ngModel)] = two-way','*ngIf, *ngFor directives'],
       exercise:'Tạo form với two-way binding và validation'},
      {id:'components',title:'Components & Input/Output',
       theory:'<p>Components = building blocks. @Input() nhận data, @Output() emit events.</p>',
       code:'// child.component.ts\n@Component({\n  selector: \'app-card\',\n  template: `\n    <div class="card">\n      <h3>{{ title }}</h3>\n      <ng-content></ng-content>\n      <button (click)="onAction.emit(title)">Action</button>\n    </div>\n  `\n})\nexport class CardComponent {\n  @Input() title: string = \'\';\n  @Output() onAction = new EventEmitter<string>();\n}\n\n// parent usage\n// <app-card [title]="\'My Card\'" (onAction)="handleAction($event)">\n//   <p>Card content here</p>\n// </app-card>',
       lang:'typescript',
       keyPoints:['@Input() = props from parent','@Output() = events to parent','ng-content = slots','Component lifecycle hooks'],
       exercise:'Tạo reusable Alert component với Input/Output'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Services, DI & Routing',lessons:[
      {id:'services',title:'Services & Dependency Injection',
       theory:'<p>Services = nơi chứa business logic. DI (Dependency Injection) inject services vào components.</p>',
       code:'// user.service.ts\n@Injectable({ providedIn: \'root\' })\nexport class UserService {\n  private apiUrl = \'/api/users\';\n\n  constructor(private http: HttpClient) {}\n\n  getUsers(): Observable<User[]> {\n    return this.http.get<User[]>(this.apiUrl);\n  }\n\n  getUserById(id: number): Observable<User> {\n    return this.http.get<User>(`${this.apiUrl}/${id}`);\n  }\n}\n\n// Component injection\n@Component({ ... })\nexport class UserListComponent {\n  users$ = this.userService.getUsers();\n  constructor(private userService: UserService) {}\n}',
       lang:'typescript',
       keyPoints:['@Injectable() decorator','providedIn: root = singleton','HttpClient for HTTP','Constructor injection'],
       exercise:'Tạo TodoService với CRUD operations'},
      {id:'routing',title:'Angular Router',
       theory:'<p>Angular Router: route config, lazy loading, guards, resolvers.</p>',
       code:'// app-routing.module.ts\nconst routes: Routes = [\n  { path: \'\', component: HomeComponent },\n  { path: \'users\', component: UserListComponent },\n  { path: \'user/:id\', component: UserDetailComponent },\n  {\n    path: \'admin\',\n    loadChildren: () => import(\'./admin/admin.module\')\n      .then(m => m.AdminModule),\n    canActivate: [AuthGuard]\n  },\n  { path: \'**\', component: NotFoundComponent }\n];\n\n// AuthGuard\n@Injectable({ providedIn: \'root\' })\nexport class AuthGuard implements CanActivate {\n  canActivate(): boolean {\n    return this.authService.isLoggedIn();\n  }\n}',
       lang:'typescript',
       keyPoints:['Route configuration','Lazy loading modules','Route guards (canActivate)','Route parameters :id'],
       exercise:'Tạo app multi-page với route guards'},
      {id:'rxjs',title:'RxJS & Observables',
       theory:'<p>RxJS = reactive programming. Observables, operators, subscriptions.</p>',
       code:'import { from, interval, of } from \'rxjs\';\nimport { map, filter, switchMap, debounceTime, distinctUntilChanged } from \'rxjs/operators\';\n\n// Search with debounce\nthis.searchInput.valueChanges.pipe(\n  debounceTime(300),\n  distinctUntilChanged(),\n  switchMap(query => this.searchService.search(query))\n).subscribe(results => {\n  this.results = results;\n});\n\n// Combine streams\ncombineLatest([users$, posts$]).pipe(\n  map(([users, posts]) => ({\n    users, posts,\n    total: users.length + posts.length\n  }))\n);',
       lang:'typescript',
       keyPoints:['Observable = async stream','Operators: map, filter, switchMap','pipe() chain operators','Subscribe to consume'],
       exercise:'Tạo search với debounce dùng RxJS'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Forms & State Management',lessons:[
      {id:'forms',title:'Reactive Forms',
       theory:'<p>Reactive Forms: FormGroup, FormControl, validators, dynamic forms.</p>',
       code:'@Component({ ... })\nexport class RegistrationComponent {\n  form = new FormGroup({\n    name: new FormControl(\'\', [Validators.required, Validators.minLength(3)]),\n    email: new FormControl(\'\', [Validators.required, Validators.email]),\n    password: new FormControl(\'\', [Validators.required, Validators.minLength(8)]),\n    confirmPassword: new FormControl(\'\')\n  }, { validators: this.passwordMatch });\n\n  passwordMatch(group: FormGroup) {\n    const pass = group.get(\'password\')?.value;\n    const confirm = group.get(\'confirmPassword\')?.value;\n    return pass === confirm ? null : { mismatch: true };\n  }\n\n  onSubmit() {\n    if (this.form.valid) {\n      console.log(this.form.value);\n    }\n  }\n}',
       lang:'typescript',
       keyPoints:['FormGroup / FormControl','Built-in validators','Custom validators','Form state tracking'],
       exercise:'Tạo registration form với validation đầy đủ'},
      {id:'ngrx',title:'NgRx State Management',
       theory:'<p>NgRx = Redux pattern cho Angular. Store, actions, reducers, effects.</p>',
       code:'// Actions\nexport const loadUsers = createAction(\'[User] Load Users\');\nexport const loadUsersSuccess = createAction(\'[User] Load Success\', props<{ users: User[] }>());\n\n// Reducer\nconst userReducer = createReducer(\n  initialState,\n  on(loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false }))\n);\n\n// Effects\n@Injectable()\nexport class UserEffects {\n  loadUsers$ = createEffect(() =>\n    this.actions$.pipe(\n      ofType(loadUsers),\n      switchMap(() => this.userService.getAll().pipe(\n        map(users => loadUsersSuccess({ users }))\n      ))\n    )\n  );\n}',
       lang:'typescript',
       keyPoints:['Actions = events','Reducers = state transitions','Effects = side effects','Selectors = derived state'],
       exercise:'Implement NgRx store cho Todo app'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Testing & Performance',lessons:[
      {id:'testing',title:'Testing Angular Apps',
       theory:'<p>Angular testing: Jasmine + Karma cho unit tests, Protractor/Cypress cho E2E.</p>',
       code:'describe(\'UserService\', () => {\n  let service: UserService;\n  let httpMock: HttpTestingController;\n\n  beforeEach(() => {\n    TestBed.configureTestingModule({\n      imports: [HttpClientTestingModule],\n      providers: [UserService]\n    });\n    service = TestBed.inject(UserService);\n    httpMock = TestBed.inject(HttpTestingController);\n  });\n\n  it(\'should fetch users\', () => {\n    const mockUsers = [{ id: 1, name: \'Test\' }];\n    service.getUsers().subscribe(users => {\n      expect(users.length).toBe(1);\n      expect(users[0].name).toBe(\'Test\');\n    });\n    const req = httpMock.expectOne(\'/api/users\');\n    req.flush(mockUsers);\n  });\n});',
       lang:'typescript',
       keyPoints:['TestBed configuration','HttpTestingController','Component testing','E2E with Cypress'],
       exercise:'Viết unit tests cho service và component'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Enterprise Patterns',lessons:[
      {id:'enterprise',title:'Enterprise Angular Architecture',
       theory:'<p>Enterprise: monorepo (Nx), micro-frontends, custom libraries, CI/CD.</p>',
       code:'// Nx monorepo structure\n// apps/\n//   web-app/\n//   admin-panel/\n// libs/\n//   shared/ui/\n//   shared/data-access/\n//   feature/auth/\n\n// Shared library\n// libs/shared/ui/src/button/\n@Component({\n  selector: \'shared-button\',\n  template: `<button [class]="variant" [disabled]="loading">\n    <span *ngIf="loading">⏳</span>\n    <ng-content></ng-content>\n  </button>`\n})\nexport class ButtonComponent {\n  @Input() variant: \'primary\' | \'secondary\' = \'primary\';\n  @Input() loading = false;\n}',
       lang:'typescript',
       keyPoints:['Nx monorepo','Shared libraries','Micro-frontends','Module federation'],
       exercise:'Setup Nx workspace với shared library'}
    ]}
  ]
};
