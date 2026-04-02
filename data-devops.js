// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — Kubernetes & CI/CD & AWS Curriculum (DevOps)
// ═══════════════════════════════════════════════════════════════

const DATA_KUBERNETES = {
  id:'kubernetes', name:'Kubernetes', icon:'☸️', color:'#326CE5',
  gradient:'linear-gradient(135deg,#326CE5,#1D4ED8)',
  category:'tool',
  description:'Container orchestration — deploy, scale, manage containerized apps',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'K8s fundamentals',lessons:[
      {id:'intro',title:'Kubernetes Overview & Architecture',
       theory:'<p><b>Kubernetes (K8s)</b> = open-source container orchestration platform. Tự động deploy, scale, quản lý containers.</p><p>Components: Control Plane (API Server, etcd, Scheduler, Controller Manager) + Worker Nodes (kubelet, kube-proxy).</p>',
       code:'# Pod — smallest deployable unit\napiVersion: v1\nkind: Pod\nmetadata:\n  name: my-app\n  labels:\n    app: web\nspec:\n  containers:\n  - name: web\n    image: nginx:alpine\n    ports:\n    - containerPort: 80\n    resources:\n      requests:\n        memory: "64Mi"\n        cpu: "250m"\n      limits:\n        memory: "128Mi"\n        cpu: "500m"\n\n# kubectl commands\n# kubectl apply -f pod.yaml\n# kubectl get pods\n# kubectl describe pod my-app\n# kubectl logs my-app\n# kubectl exec -it my-app -- /bin/sh',
       lang:'yaml',
       keyPoints:['Pod = smallest unit','Container spec in Pod','Resource requests/limits','kubectl CLI'],
       exercise:'Deploy nginx pod và explore kubectl commands'},
      {id:'deployments',title:'Deployments & Services',
       theory:'<p>Deployment quản lý ReplicaSets. Service expose pods ra network.</p>',
       code:'# Deployment — manages replicas\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n      - name: web\n        image: myapp:v1.0\n        ports:\n        - containerPort: 3000\n        env:\n        - name: NODE_ENV\n          value: "production"\n        - name: DB_URL\n          valueFrom:\n            secretKeyRef:\n              name: db-secret\n              key: url\n---\n# Service — network access\napiVersion: v1\nkind: Service\nmetadata:\n  name: web-service\nspec:\n  type: LoadBalancer\n  selector:\n    app: web\n  ports:\n  - port: 80\n    targetPort: 3000',
       lang:'yaml',
       keyPoints:['Deployment = desired state','ReplicaSet = pod replicas','Service types: ClusterIP, NodePort, LoadBalancer','Labels & selectors'],
       exercise:'Deploy 3-replica web app với Service'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'ConfigMaps, Secrets, Volumes',lessons:[
      {id:'config',title:'ConfigMaps & Secrets',
       theory:'<p>ConfigMap = external config. Secret = sensitive data (encoded). Tách config khỏi image.</p>',
       code:'# ConfigMap\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:\n  APP_ENV: "production"\n  LOG_LEVEL: "info"\n  config.json: |\n    {\n      "features": { "darkMode": true },\n      "cache": { "ttl": 3600 }\n    }\n---\n# Secret\napiVersion: v1\nkind: Secret\nmetadata:\n  name: db-secret\ntype: Opaque\nstringData:\n  DB_PASSWORD: "my-secret-password"\n  API_KEY: "sk-1234567890"\n---\n# Using in Pod\nspec:\n  containers:\n  - name: app\n    envFrom:\n    - configMapRef:\n        name: app-config\n    - secretRef:\n        name: db-secret\n    volumeMounts:\n    - name: config-vol\n      mountPath: /etc/config\n  volumes:\n  - name: config-vol\n    configMap:\n      name: app-config',
       lang:'yaml',
       keyPoints:['ConfigMap for non-sensitive config','Secret for passwords/keys','envFrom mounts all keys','Volume mount for files'],
       exercise:'Externalize app config với ConfigMap + Secret'},
      {id:'scaling',title:'Auto-Scaling & Rolling Updates',
       theory:'<p>HPA scales pods theo metrics. Rolling update = zero-downtime deploys.</p>',
       code:'# Horizontal Pod Autoscaler\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: web-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: web-app\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n  - type: Resource\n    resource:\n      name: cpu\n      target:\n        type: Utilization\n        averageUtilization: 70\n  - type: Resource\n    resource:\n      name: memory\n      target:\n        type: Utilization\n        averageUtilization: 80\n\n# Rolling update strategy\nspec:\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1        # max extra pods\n      maxUnavailable: 0  # zero downtime!\n\n# kubectl commands\n# kubectl rollout status deployment/web-app\n# kubectl rollout history deployment/web-app\n# kubectl rollout undo deployment/web-app',
       lang:'yaml',
       keyPoints:['HPA = auto-scale by CPU/memory','Rolling update strategy','Zero downtime deploys','Rollback support'],
       exercise:'Setup HPA cho web app deployment'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Networking & Ingress',lessons:[
      {id:'ingress',title:'Ingress & Networking',
       theory:'<p>Ingress = HTTP/HTTPS routing vào cluster. Network Policies cho security.</p>',
       code:'# Ingress — HTTP routing\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: app-ingress\n  annotations:\n    nginx.ingress.kubernetes.io/ssl-redirect: "true"\n    cert-manager.io/cluster-issuer: "letsencrypt"\nspec:\n  tls:\n  - hosts:\n    - myapp.com\n    secretName: tls-secret\n  rules:\n  - host: myapp.com\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: frontend\n            port: { number: 80 }\n      - path: /api\n        pathType: Prefix\n        backend:\n          service:\n            name: backend\n            port: { number: 3000 }\n\n---\n# Network Policy — restrict traffic\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: api-policy\nspec:\n  podSelector:\n    matchLabels: { app: api }\n  ingress:\n  - from:\n    - podSelector:\n        matchLabels: { app: frontend }',
       lang:'yaml',
       keyPoints:['Path-based routing','TLS/SSL termination','Network policies','Service mesh basics'],
       exercise:'Setup Ingress cho multi-service app'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Helm & Operators',lessons:[
      {id:'helm',title:'Helm Charts & Templating',
       theory:'<p>Helm = package manager cho K8s. Charts = reusable templates.</p>',
       code:'# Chart structure\n# mychart/\n#   Chart.yaml\n#   values.yaml\n#   templates/\n#     deployment.yaml\n#     service.yaml\n\n# values.yaml\nreplicaCount: 3\nimage:\n  repository: myapp\n  tag: "v1.0"\nservice:\n  type: LoadBalancer\n  port: 80\nresources:\n  limits:\n    cpu: 500m\n    memory: 128Mi\n\n# templates/deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ .Release.Name }}-app\nspec:\n  replicas: {{ .Values.replicaCount }}\n  template:\n    spec:\n      containers:\n      - name: {{ .Chart.Name }}\n        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n        resources:\n          {{- toYaml .Values.resources | nindent 10 }}\n\n# Install\n# helm install my-release ./mychart --values prod-values.yaml\n# helm upgrade my-release ./mychart\n# helm rollback my-release 1',
       lang:'yaml',
       keyPoints:['Values = configuration','Templates = Go templating','helm install/upgrade/rollback','Chart versioning'],
       exercise:'Tạo Helm chart cho full-stack app'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Production Best Practices',lessons:[
      {id:'production',title:'Production K8s Architecture',
       theory:'<p>Production: monitoring (Prometheus/Grafana), logging (ELK), GitOps (ArgoCD).</p>',
       code:'# Prometheus ServiceMonitor\napiVersion: monitoring.coreos.com/v1\nkind: ServiceMonitor\nmetadata:\n  name: app-monitor\nspec:\n  selector:\n    matchLabels: { app: web }\n  endpoints:\n  - port: metrics\n    interval: 30s\n\n# ArgoCD Application (GitOps)\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: my-app\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/org/k8s-manifests\n    targetRevision: main\n    path: apps/production\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true',
       lang:'yaml',
       keyPoints:['Prometheus + Grafana monitoring','GitOps with ArgoCD','Resource quotas','Pod Disruption Budgets'],
       exercise:'Setup monitoring + GitOps pipeline'}
    ]}
  ]
};

const DATA_CICD = {
  id:'cicd', name:'CI/CD', icon:'🔄', color:'#2088FF',
  gradient:'linear-gradient(135deg,#2088FF,#7C3AED)',
  category:'tool',
  description:'Continuous Integration/Deployment — GitHub Actions, pipelines, automation',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'CI/CD basics',lessons:[
      {id:'intro',title:'CI/CD Concepts & GitHub Actions',
       theory:'<p><b>CI</b> = tự động build + test mỗi commit. <b>CD</b> = tự động deploy khi tests pass. GitHub Actions = built-in CI/CD platform.</p>',
       code:'# .github/workflows/ci.yml\nname: CI Pipeline\n\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n    - uses: actions/setup-node@v4\n      with:\n        node-version: 20\n        cache: npm\n\n    - run: npm ci\n    - run: npm run lint\n    - run: npm test\n    - run: npm run build\n\n    - name: Upload coverage\n      uses: codecov/codecov-action@v3\n      with:\n        file: ./coverage/lcov.info',
       lang:'yaml',
       keyPoints:['Trigger on push/PR','Jobs run in parallel','Steps execute sequentially','Actions marketplace'],
       exercise:'Tạo CI workflow cho Node.js project'},
      {id:'deploy',title:'Automated Deployment',
       theory:'<p>CD pipeline: test → build → deploy automatically. Environments, secrets, approvals.</p>',
       code:'# .github/workflows/deploy.yml\nname: Deploy\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n    - run: npm ci && npm test\n\n  deploy-staging:\n    needs: test\n    runs-on: ubuntu-latest\n    environment: staging\n    steps:\n    - uses: actions/checkout@v4\n    - name: Deploy to staging\n      run: |\n        echo "Deploying to staging..."\n        npx vercel --token ${{ secrets.VERCEL_TOKEN }}\n\n  deploy-production:\n    needs: deploy-staging\n    runs-on: ubuntu-latest\n    environment:\n      name: production\n      url: https://myapp.com\n    steps:\n    - uses: actions/checkout@v4\n    - name: Deploy to production\n      run: |\n        npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}',
       lang:'yaml',
       keyPoints:['needs: dependency chain','Environments (staging/prod)','Secrets management','Manual approval gates'],
       exercise:'Setup staging → production deployment'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Docker builds & Caching',lessons:[
      {id:'docker-build',title:'Docker Build & Push in CI',
       theory:'<p>Build Docker images trong CI, push lên registry, deploy container.</p>',
       code:'jobs:\n  build-and-push:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n\n    - name: Login to Docker Hub\n      uses: docker/login-action@v3\n      with:\n        username: ${{ secrets.DOCKER_USERNAME }}\n        password: ${{ secrets.DOCKER_TOKEN }}\n\n    - name: Build and push\n      uses: docker/build-push-action@v5\n      with:\n        context: .\n        push: true\n        tags: |\n          myorg/myapp:${{ github.sha }}\n          myorg/myapp:latest\n        cache-from: type=gha\n        cache-to: type=gha,mode=max\n\n    - name: Deploy to Cloud Run\n      uses: google-github-actions/deploy-cloudrun@v2\n      with:\n        service: myapp\n        image: myorg/myapp:${{ github.sha }}',
       lang:'yaml',
       keyPoints:['Docker build in CI','Image tagging with SHA','Layer caching','Multi-platform builds'],
       exercise:'Setup Docker build + push pipeline'},
      {id:'matrix',title:'Matrix Strategy & Reusable Workflows',
       theory:'<p>Matrix = test multiple versions. Reusable workflows = DRY CI/CD.</p>',
       code:'# Matrix testing\njobs:\n  test:\n    strategy:\n      matrix:\n        node-version: [18, 20, 22]\n        os: [ubuntu-latest, windows-latest]\n    runs-on: ${{ matrix.os }}\n    steps:\n    - uses: actions/checkout@v4\n    - uses: actions/setup-node@v4\n      with:\n        node-version: ${{ matrix.node-version }}\n    - run: npm ci && npm test\n\n# Reusable workflow\n# .github/workflows/shared-deploy.yml\non:\n  workflow_call:\n    inputs:\n      environment:\n        required: true\n        type: string\n    secrets:\n      deploy_token:\n        required: true\n\njobs:\n  deploy:\n    environment: ${{ inputs.environment }}\n    steps:\n    - run: echo "Deploying to ${{ inputs.environment }}"',
       lang:'yaml',
       keyPoints:['Matrix = parallel combos','Reusable workflows','workflow_call trigger','Composite actions'],
       exercise:'Tạo matrix test + reusable deploy workflow'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Advanced pipelines',lessons:[
      {id:'advanced',title:'Monorepo & Conditional Workflows',
       theory:'<p>Monorepo CI: only build changed packages. Path filters, conditional jobs.</p>',
       code:'# Path-based triggers\non:\n  push:\n    paths:\n      - \'packages/frontend/**\'\n      - \'packages/shared/**\'\n\njobs:\n  detect-changes:\n    runs-on: ubuntu-latest\n    outputs:\n      frontend: ${{ steps.changes.outputs.frontend }}\n      backend: ${{ steps.changes.outputs.backend }}\n    steps:\n    - uses: dorny/paths-filter@v3\n      id: changes\n      with:\n        filters: |\n          frontend:\n            - \'packages/frontend/**\'\n          backend:\n            - \'packages/backend/**\'\n\n  build-frontend:\n    needs: detect-changes\n    if: needs.detect-changes.outputs.frontend == \'true\'\n    runs-on: ubuntu-latest\n    steps:\n    - run: echo "Building frontend..."\n\n  build-backend:\n    needs: detect-changes\n    if: needs.detect-changes.outputs.backend == \'true\'\n    runs-on: ubuntu-latest\n    steps:\n    - run: echo "Building backend..."',
       lang:'yaml',
       keyPoints:['Path filters','Change detection','Conditional jobs (if)','Job outputs'],
       exercise:'Setup monorepo CI with selective builds'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Security & Quality Gates',lessons:[
      {id:'security',title:'Security Scanning & Quality Gates',
       theory:'<p>CI security: SAST, dependency scanning, container scanning, quality gates.</p>',
       code:'jobs:\n  security:\n    runs-on: ubuntu-latest\n    steps:\n    # Dependency vulnerability scan\n    - name: Audit dependencies\n      run: npm audit --production --audit-level=high\n\n    # SAST (Static Analysis)\n    - name: CodeQL Analysis\n      uses: github/codeql-action/analyze@v3\n      with:\n        languages: javascript\n\n    # Container scan\n    - name: Scan Docker image\n      uses: aquasecurity/trivy-action@master\n      with:\n        image-ref: myapp:latest\n        severity: CRITICAL,HIGH\n        exit-code: 1\n\n    # Secret detection\n    - name: Detect secrets\n      uses: trufflesecurity/trufflehog@main\n      with:\n        extra_args: --only-verified\n\n  quality-gate:\n    needs: [test, security]\n    runs-on: ubuntu-latest\n    steps:\n    - name: Check coverage threshold\n      run: |\n        COVERAGE=$(cat coverage/coverage-summary.json | jq \'.total.lines.pct\')\n        if (( $(echo "$COVERAGE < 80" | bc -l) )); then\n          echo "❌ Coverage $COVERAGE% < 80%"\n          exit 1\n        fi',
       lang:'yaml',
       keyPoints:['SAST scanning (CodeQL)','Dependency auditing','Container vulnerability scan','Coverage thresholds'],
       exercise:'Add security scanning pipeline'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'GitOps & Advanced Patterns',lessons:[
      {id:'gitops',title:'GitOps & Multi-Environment',
       theory:'<p>GitOps = Git as single source of truth. Declarative infrastructure, auto-sync.</p>',
       code:'# Feature branch → PR → Review → Merge → Auto-deploy\n\n# Multi-environment promotion\n# environments/\n#   dev/\n#     values.yaml    (auto-deploy on merge)\n#   staging/\n#     values.yaml    (auto-deploy after dev)\n#   production/\n#     values.yaml    (manual approval)\n\n# Workflow with approval\njobs:\n  promote-to-prod:\n    environment:\n      name: production\n      url: https://myapp.com\n    steps:\n    - name: Wait for approval\n      uses: trstringer/manual-approval@v1\n      with:\n        approvers: tech-lead,cto\n        minimum-approvals: 1\n\n    - name: Blue-Green Deploy\n      run: |\n        # Deploy to green\n        kubectl apply -f k8s/ --namespace=green\n        # Health check\n        kubectl rollout status deployment/app -n green\n        # Switch traffic\n        kubectl patch service main-lb -p \\\n          \'{"spec":{"selector":{"version":"green"}}}\'',
       lang:'yaml',
       keyPoints:['GitOps principles','Environment promotion','Blue-green deployment','Canary releases'],
       exercise:'Setup GitOps pipeline với ArgoCD'}
    ]}
  ]
};

const DATA_NGINX = {
  id:'nginx', name:'Nginx & Linux', icon:'🐧', color:'#009639',
  gradient:'linear-gradient(135deg,#009639,#4A90D9)',
  category:'tool',
  description:'Web server, reverse proxy, load balancing — Linux server admin',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Nginx basics',lessons:[
      {id:'intro',title:'Nginx Overview & Installation',
       theory:'<p><b>Nginx</b> = high-performance web server, reverse proxy, load balancer. Sử dụng rộng rãi nhất cho production web apps.</p>',
       code:'# Install Nginx\n# Ubuntu: sudo apt install nginx\n# CentOS: sudo yum install nginx\n\n# Basic config /etc/nginx/sites-available/default\nserver {\n    listen 80;\n    server_name example.com www.example.com;\n\n    # Serve static files\n    root /var/www/html;\n    index index.html;\n\n    location / {\n        try_files $uri $uri/ =404;\n    }\n\n    # Logs\n    access_log /var/log/nginx/access.log;\n    error_log /var/log/nginx/error.log;\n}\n\n# Commands\n# sudo nginx -t          # Test config\n# sudo systemctl reload nginx\n# sudo systemctl status nginx',
       lang:'nginx',
       keyPoints:['server block = virtual host','listen port','root = document root','try_files for SPA'],
       exercise:'Setup Nginx serve static website'},
      {id:'reverse-proxy',title:'Reverse Proxy & Node.js',
       theory:'<p>Reverse proxy: Nginx nhận request → forward đến backend (Node.js, Python, etc.).</p>',
       code:'# Reverse proxy to Node.js\nserver {\n    listen 80;\n    server_name api.example.com;\n\n    location / {\n        proxy_pass http://localhost:3000;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n\n        # WebSocket support\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n    }\n\n    # API routes\n    location /api/ {\n        proxy_pass http://localhost:3000/api/;\n        proxy_read_timeout 60s;\n    }\n\n    # Static files (cached)\n    location /static/ {\n        root /var/www;\n        expires 30d;\n        add_header Cache-Control "public, immutable";\n    }\n}',
       lang:'nginx',
       keyPoints:['proxy_pass to backend','WebSocket upgrade','Cache static files','Request headers forwarding'],
       exercise:'Setup reverse proxy cho Node.js app'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'SSL & Load Balancing',lessons:[
      {id:'ssl',title:'SSL/TLS & HTTPS',
       theory:'<p>HTTPS = encrypted connection. Let\'s Encrypt = free SSL certificates.</p>',
       code:'# SSL with Let\'s Encrypt\n# sudo certbot --nginx -d example.com -d www.example.com\n\nserver {\n    listen 443 ssl http2;\n    server_name example.com;\n\n    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;\n\n    # Security headers\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;\n    ssl_prefer_server_ciphers off;\n\n    add_header Strict-Transport-Security "max-age=63072000" always;\n    add_header X-Content-Type-Options nosniff;\n    add_header X-Frame-Options DENY;\n\n    location / {\n        proxy_pass http://localhost:3000;\n    }\n}\n\n# HTTP → HTTPS redirect\nserver {\n    listen 80;\n    server_name example.com;\n    return 301 https://$server_name$request_uri;\n}',
       lang:'nginx',
       keyPoints:['SSL certificate setup','HTTP/2 support','Security headers','HTTP → HTTPS redirect'],
       exercise:'Setup HTTPS với Let\'s Encrypt'},
      {id:'loadbalance',title:'Load Balancing',
       theory:'<p>Load balancing: distribute traffic across multiple backend servers.</p>',
       code:'# Upstream — multiple backends\nupstream backend {\n    # Round-robin (default)\n    server 127.0.0.1:3001;\n    server 127.0.0.1:3002;\n    server 127.0.0.1:3003;\n\n    # Weighted\n    # server 127.0.0.1:3001 weight=3;\n    # server 127.0.0.1:3002 weight=1;\n\n    # Least connections\n    # least_conn;\n\n    # IP hash (sticky sessions)\n    # ip_hash;\n\n    # Health check\n    server 127.0.0.1:3004 backup;\n}\n\nserver {\n    listen 80;\n    location / {\n        proxy_pass http://backend;\n        proxy_next_upstream error timeout;\n        proxy_connect_timeout 5s;\n    }\n}',
       lang:'nginx',
       keyPoints:['upstream block','Round-robin / weighted','Sticky sessions (ip_hash)','Backup servers'],
       exercise:'Setup load balancer cho 3 Node.js instances'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Performance tuning',lessons:[
      {id:'perf',title:'Performance & Caching',
       theory:'<p>Nginx performance: gzip compression, browser caching, rate limiting, micro-caching.</p>',
       code:'# Performance optimization\nhttp {\n    # Gzip compression\n    gzip on;\n    gzip_vary on;\n    gzip_min_length 1024;\n    gzip_types text/plain text/css application/json\n               application/javascript text/xml;\n\n    # Browser caching\n    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {\n        expires 1y;\n        add_header Cache-Control "public, immutable";\n    }\n\n    # Rate limiting\n    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\n    location /api/ {\n        limit_req zone=api burst=20 nodelay;\n        proxy_pass http://backend;\n    }\n\n    # Connection limits\n    limit_conn_zone $binary_remote_addr zone=addr:10m;\n    limit_conn addr 100;\n\n    # Timeouts\n    client_body_timeout 12;\n    client_header_timeout 12;\n    keepalive_timeout 15;\n    send_timeout 10;\n}',
       lang:'nginx',
       keyPoints:['Gzip compression','Browser cache headers','Rate limiting','Connection limits'],
       exercise:'Optimize Nginx cho high-traffic site'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Linux server admin',lessons:[
      {id:'linux',title:'Linux Server Administration',
       theory:'<p>Linux admin: process management, systemd, firewall, monitoring.</p>',
       code:'# System monitoring\ntop -c                    # Process viewer\nhtop                      # Interactive process viewer\ndf -h                     # Disk usage\nfree -m                   # Memory usage\nnetstat -tlnp             # Open ports\nss -tlnp                  # Modern netstat\n\n# Systemd service management\nsudo systemctl status nginx\nsudo systemctl restart nginx\nsudo systemctl enable nginx  # Start on boot\n\n# Custom service\n# /etc/systemd/system/myapp.service\n[Unit]\nDescription=My Node.js App\nAfter=network.target\n\n[Service]\nUser=www-data\nWorkingDirectory=/var/www/myapp\nExecStart=/usr/bin/node server.js\nRestart=on-failure\nRestartSec=5\nEnvironment=NODE_ENV=production PORT=3000\n\n[Install]\nWantedBy=multi-user.target\n\n# Firewall (UFW)\nsudo ufw allow 22/tcp   # SSH\nsudo ufw allow 80/tcp   # HTTP\nsudo ufw allow 443/tcp  # HTTPS\nsudo ufw enable',
       lang:'bash',
       keyPoints:['Process monitoring','systemd services','UFW firewall','Log management'],
       exercise:'Setup systemd service cho Node.js app'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Production architecture',lessons:[
      {id:'architecture',title:'Production Infrastructure',
       theory:'<p>Complete production setup: CDN, monitoring, backup, disaster recovery.</p>',
       code:'# Production Nginx architecture\n# CDN (Cloudflare) → Nginx LB → App Servers\n\n# Main Nginx config for production\nworker_processes auto;\nworker_rlimit_nofile 65535;\n\nevents {\n    worker_connections 65535;\n    multi_accept on;\n    use epoll;\n}\n\nhttp {\n    # Security\n    server_tokens off;\n    more_clear_headers Server;\n\n    # DDoS protection\n    limit_req_zone $binary_remote_addr zone=general:10m rate=50r/s;\n    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;\n\n    # Monitoring with Prometheus\n    server {\n        listen 9113;\n        location /metrics {\n            stub_status;\n        }\n    }\n\n    # Backup cron\n    # 0 2 * * * /usr/local/bin/backup.sh\n    # Monitoring: Prometheus + Grafana + AlertManager\n    # Logging: rsyslog → Elasticsearch → Kibana\n}',
       lang:'nginx',
       keyPoints:['Worker tuning','DDoS protection','Monitoring integration','Backup strategy'],
       exercise:'Design production infrastructure diagram'}
    ]}
  ]
};
