// SWE-literacy Kubernetes content. Explicitly excludes StatefulSets, Operators,
// Helm internals, CRDs, and network policies — those are platform/SRE scope.

export interface K8sResource {
  name: string;
  purpose: string;
  detail: string;
}

export interface K8sCommand {
  caption: string;
  command: string;
  note?: string;
}

export interface K8sProbe {
  probe: string;
  answers: string;
  failureBehavior: string;
  whenToUse: string;
}

export const coreResources: K8sResource[] = [
  {
    name: 'Pod',
    purpose: 'Smallest deployable unit — one or more containers that share network and storage.',
    detail:
      'Pods are disposable. You rarely create a Pod directly; a Deployment / Job / DaemonSet creates them for you and replaces them when they die. IP addresses change on restart — never refer to a pod by IP.',
  },
  {
    name: 'Deployment',
    purpose: 'Declarative management of replicated stateless pods.',
    detail:
      'You describe "I want N replicas of this pod template"; the controller makes it true. Rolling updates, pause/resume, and one-command rollback come free (`kubectl rollout undo`).',
  },
  {
    name: 'Service',
    purpose: 'Stable virtual IP + DNS name in front of a changing set of pods.',
    detail:
      'Four types. ClusterIP: in-cluster only (default). NodePort: exposed on every node at a high port. LoadBalancer: cloud-provisioned external LB. ExternalName: CNAME to an external host — useful for abstracting external dependencies.',
  },
  {
    name: 'Ingress',
    purpose: 'HTTP(S) routing to services based on hostname / path.',
    detail:
      'Not a resource the cluster implements on its own — requires an Ingress Controller (nginx-ingress, Traefik, cloud-native). The Ingress object is the spec; the Controller turns it into real load-balancer rules.',
  },
  {
    name: 'ConfigMap',
    purpose: 'Non-sensitive key/value config, decoupled from the image.',
    detail:
      'Mount as env vars or as files under a volume. Changes do NOT auto-restart pods — either roll the Deployment or use a tool like reloader. Config is the right place for feature flags, environment names, tuning knobs.',
  },
  {
    name: 'Secret',
    purpose: 'Same as ConfigMap but for sensitive values.',
    detail:
      'Secrets are NOT encrypted by default — only base64-encoded. Enable encryption-at-rest in etcd, restrict RBAC to view secrets, and consider an external secrets operator for real key management.',
  },
];

export const probes: K8sProbe[] = [
  {
    probe: 'Liveness',
    answers: 'Is this container wedged? Should I kill it?',
    failureBehavior: 'Kubelet restarts the container',
    whenToUse:
      'For deadlock detection — process is running but making no progress. Keep it cheap; a flaky liveness probe causes restart loops',
  },
  {
    probe: 'Readiness',
    answers: 'Is this container ready to serve traffic?',
    failureBehavior: 'Pod is removed from Service endpoints until it recovers',
    whenToUse:
      'For warm-up, transient downstream outages, circuit-breaker integration. Failing a readiness probe is NOT destructive — the pod keeps running',
  },
  {
    probe: 'Startup',
    answers: 'Has the app finished starting?',
    failureBehavior: 'Disables liveness / readiness until it passes; kills pod on timeout',
    whenToUse:
      'For slow-starting apps (JVM warm-up, large caches) — lets liveness have a tight timeout in steady state without triggering during startup',
  },
];

export const rollingUpdateCommands: K8sCommand[] = [
  {
    caption: 'Apply a manifest change',
    command: 'kubectl apply -f deployment.yaml',
  },
  {
    caption: 'Watch the rollout progress',
    command: 'kubectl rollout status deployment/my-app',
  },
  {
    caption: 'Pause mid-rollout (hold current progress)',
    command: 'kubectl rollout pause deployment/my-app',
  },
  {
    caption: 'Resume',
    command: 'kubectl rollout resume deployment/my-app',
  },
  {
    caption: 'Rollback to previous revision',
    command: 'kubectl rollout undo deployment/my-app',
  },
  {
    caption: 'Rollback to a specific revision',
    command: 'kubectl rollout undo deployment/my-app --to-revision=3',
  },
  {
    caption: 'See rollout history',
    command: 'kubectl rollout history deployment/my-app',
  },
];

export const kubectlEssentials: K8sCommand[] = [
  {
    caption: 'List pods in the current namespace',
    command: 'kubectl get pods',
  },
  {
    caption: 'Watch pods live',
    command: 'kubectl get pods -w',
  },
  {
    caption: 'All resources in a namespace',
    command: 'kubectl get all -n my-namespace',
  },
  {
    caption: 'Wide output (IPs, node)',
    command: 'kubectl get pods -o wide',
  },
  {
    caption: 'Full YAML of a resource',
    command: 'kubectl get pod my-pod -o yaml',
  },
  {
    caption: 'Events + config + status on a single resource',
    command: 'kubectl describe pod my-pod',
  },
  {
    caption: 'Tail logs',
    command: 'kubectl logs -f my-pod',
  },
  {
    caption: 'Logs from previous (crashed) container',
    command: 'kubectl logs my-pod --previous',
  },
  {
    caption: 'Multi-container pod — pick a container',
    command: 'kubectl logs my-pod -c my-container',
  },
  {
    caption: 'Interactive shell into a container',
    command: 'kubectl exec -it my-pod -- sh',
  },
  {
    caption: 'Port-forward to your local machine',
    command: 'kubectl port-forward my-pod 8080:80',
  },
  {
    caption: 'Resource usage (requires metrics-server)',
    command: 'kubectl top pods',
    note: 'metrics-server must be installed',
  },
  {
    caption: 'Context + namespace at a glance',
    command: 'kubectl config current-context && kubectl config view --minify | grep namespace',
  },
];

export const resourceRequestsNote = {
  title: 'Requests vs limits vs QoS class',
  lines: [
    'Requests: what the scheduler guarantees you have. Used for placement decisions.',
    'Limits: hard cap. CPU over-limit throttles; memory over-limit kills (OOMKilled).',
    'QoS class is derived from requests/limits: Guaranteed (req = limit for CPU and memory), Burstable (requests set, limits higher), BestEffort (nothing set).',
    'Under node pressure the kubelet evicts BestEffort first, Burstable next, Guaranteed last.',
  ],
  insight:
    'Setting memory requests = memory limits is the simplest way to get Guaranteed QoS for critical workloads — no surprise evictions. CPU limits are more subtle: they throttle even when spare CPU is available. For most workloads, set CPU requests but leave limits unset.',
};

export const k8sOutOfScope = [
  'StatefulSets (used for databases, message brokers — stateful workloads)',
  'DaemonSets (one pod per node — monitoring agents, log shippers)',
  'Jobs and CronJobs (batch workloads)',
  'HPA / VPA (horizontal / vertical pod autoscaling)',
  'Operators and CRDs (extending the API)',
  'Helm charts internals, templating, upgrade semantics',
  'Network policies, service mesh (Istio, Linkerd, Cilium)',
  'Admission controllers, pod security standards, RBAC deep-dive',
];
