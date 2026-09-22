import { PlatformFeature } from '../types';

export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    id: 'performance',
    title: 'High Performance',
    shortDesc: 'Engineered for sub-millisecond execution with zero main-thread blocking and SIMD memory buffers.',
    detailedDesc:
      'Every Flux plugin is benchmarked down to the CPU instruction level. We bypass reflection overhead, use off-heap memory-mapped buffers for I/O operations, and decouple heavy computations from the primary server tick loop.',
    metric: '< 0.2ms',
    metricLabel: 'Average Tick Overhead',
    iconName: 'Zap',
    tags: ['SIMD Vectorization', 'Zero-Allocation I/O', 'Off-Heap Memory', 'Lock-Free Queues'],
    specs: [
      { label: 'Throughput', value: '1.2M events/sec per node' },
      { label: 'Memory Footprint', value: '< 24MB idle baseline' },
      { label: 'Garbage Collection', value: 'Zero GC pressure allocations' },
      { label: 'Latency Jitter', value: 'P99.9 < 0.45ms' }
    ],
    codeSnippet: {
      language: 'java',
      code: `// Lock-free ring buffer offloading to asynchronous worker pool
public final class FluxRingPipeline {
    private final OffHeapBuffer ringBuffer = OffHeapBuffer.allocateDirect(1024 * 1024);
    
    public void recordPacket(final PacketFrame frame) {
        if (!ringBuffer.offer(frame)) {
            Metrics.recordBackpressureDrop();
        }
    }
}`
    }
  },
  {
    id: 'configuration',
    title: 'Easy Configuration',
    shortDesc: 'Declarative, strictly validated YAML and JSON schemas with live hot-reloading and clear error diagnostics.',
    detailedDesc:
      'Never crash your production environment from a missed indentation or syntax typo. Flux configurations feature automated schema validation, automatic migration across versions, and instant hot-reloading without requiring a server reboot.',
    metric: '100%',
    metricLabel: 'Hot-Reload Uptime',
    iconName: 'Sliders',
    tags: ['Live Hot Reload', 'Schema Auto-Validation', 'Inline Comments', 'Migration Engine'],
    specs: [
      { label: 'Reload Time', value: 'Instant (< 50ms)' },
      { label: 'Validation', value: 'Strict schema with line-specific errors' },
      { label: 'Format Support', value: 'YAML, JSON, TOML, HOCON' },
      { label: 'Backup Engine', value: 'Automatic pre-edit snapshots' }
    ],
    codeSnippet: {
      language: 'yaml',
      code: `# Live hot-reload triggered without server restart
engine:
  mode: "STRICT_HIGH_THROUGHPUT"
  workers: "AUTO_DETECT" # Dynamically maps to CPU physical cores
  diagnostics:
    live_debugger: false
    verbose_logging: false`
    }
  },
  {
    id: 'support',
    title: 'Community Support',
    shortDesc: 'Connect with developers and server owners in our Discord for quick assistance, troubleshooting, and advice.',
    detailedDesc:
      'Get assistance directly from fellow developers and administrators in our active Discord community. Share configs, troubleshoot setup issues, and collaborate.',
    metric: 'Active',
    metricLabel: 'Discord Community',
    iconName: 'Headphones',
    tags: ['Discord Assistance', 'Configuration Help', 'Setup Guides', 'Direct Feedback'],
    specs: [
      { label: 'Platform', value: 'Discord' },
      { label: 'Channels', value: 'Support & Announcements' },
      { label: 'Documentation', value: 'Complete Setup Walkthroughs' },
      { label: 'Assistance', value: 'Direct Community Feedback' }
    ],
    codeSnippet: {
      language: 'bash',
      code: `# Join our Discord community for setup guides and support
# Visit the invite link to join discussions and download updates.`
    }
  },
  {
    id: 'updates',
    title: 'Regular Updates',
    shortDesc: 'Automated CI/CD release cycles with strict backward compatibility, rapid patch turnarounds, and LTS tracks.',
    detailedDesc:
      'Staying on the cutting edge shouldn’t mean breaking your existing stack. Flux builds are automatically tested across 12 distinct runtime matrixes before reaching public release, ensuring seamless drop-in upgrades.',
    metric: '99.98%',
    metricLabel: 'Backward Compatibility',
    iconName: 'RefreshCw',
    tags: ['Automated Matrix Tests', 'SemVer Certified', 'LTS Branches', 'Zero-Downtime Rollouts'],
    specs: [
      { label: 'Release Cadence', value: 'Bi-weekly improvements, weekly patches' },
      { label: 'Compatibility Matrix', value: 'Spigot, Paper, Purpur, Folia, Velocity' },
      { label: 'Security Patch SLA', value: 'Under 6 hours for critical zero-days' },
      { label: 'Deprecation Grace', value: 'Minimum 6 months with clear warnings' }
    ],
    codeSnippet: {
      language: 'json',
      code: `{
  "release_channel": "STABLE_LTS",
  "auto_notify_updates": true,
  "download_security_patches": true,
  "compatibility_mode": "PRESERVE_ALL_LEGACY_HOOKS"
}`
    }
  }
];
