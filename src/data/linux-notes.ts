// SWE-basics Linux content. Enough to debug a container or a box, not kernel-internals depth.

export interface Signal {
  name: string;
  number: number;
  behavior: string;
  canCatch: string;
  use: string;
}

export interface LinuxCommand {
  caption: string;
  command: string;
  note?: string;
}

export interface Permission {
  symbolic: string;
  octal: string;
  meaning: string;
}

export const signals: Signal[] = [
  {
    name: 'SIGTERM',
    number: 15,
    behavior: 'Polite termination request',
    canCatch: 'Yes — the program can run cleanup handlers',
    use: 'Default for `kill`, Docker `stop`, Kubernetes pre-deletion. Programs SHOULD catch this and shut down gracefully',
  },
  {
    name: 'SIGINT',
    number: 2,
    behavior: 'Interactive interrupt',
    canCatch: 'Yes',
    use: 'What Ctrl-C sends. Same spirit as SIGTERM but from the keyboard',
  },
  {
    name: 'SIGHUP',
    number: 1,
    behavior: 'Terminal hangup or controlling-terminal death',
    canCatch: 'Yes',
    use: 'Historically: "reload your config". Many daemons still use it that way (nginx, postgres)',
  },
  {
    name: 'SIGQUIT',
    number: 3,
    behavior: 'Terminate + core dump',
    canCatch: 'Yes',
    use: 'Ctrl-\\. JVMs dump thread stacks on SIGQUIT — handy for "what is my service doing?"',
  },
  {
    name: 'SIGKILL',
    number: 9,
    behavior: 'Immediate kernel-level termination',
    canCatch: 'No — cannot be caught, blocked, or ignored',
    use: 'Last resort. After this the process is gone — no cleanup, no flushing, open files unsynced',
  },
  {
    name: 'SIGSTOP',
    number: 19,
    behavior: 'Pause the process (cannot be caught)',
    canCatch: 'No',
    use: 'Useful for freezing a misbehaving process without killing it — resume with SIGCONT',
  },
  {
    name: 'SIGPIPE',
    number: 13,
    behavior: 'Write to a pipe / socket with no reader',
    canCatch: 'Yes (default: terminate)',
    use: "`curl foo | head` ends because head exits; curl's next write raises SIGPIPE. A subtle cause of 'silently missing output' in pipelines",
  },
];

export const processCommands: LinuxCommand[] = [
  {
    caption: 'Process tree',
    command: 'ps auxf | head -30',
  },
  {
    caption: 'Top-like interactive view',
    command: 'htop',
    note: 'Falls back to `top` if htop not installed',
  },
  {
    caption: 'Who owns this port?',
    command: 'sudo ss -tlnp | grep :8080',
    note: 'ss > netstat — faster, actively maintained',
  },
  {
    caption: 'What files does this process have open?',
    command: 'lsof -p <pid>',
  },
  {
    caption: 'Syscall trace of a running process',
    command: 'sudo strace -p <pid> -f -e trace=network',
    note: 'Expensive — do not leave running on prod',
  },
  {
    caption: 'systemd service logs',
    command: 'journalctl -u my-service.service -f --since "10 min ago"',
  },
  {
    caption: 'Kernel / all logs',
    command: 'dmesg -T | tail -50',
  },
  {
    caption: 'Memory / CPU summary',
    command: 'free -h && uptime',
  },
  {
    caption: 'Disk usage of this directory tree',
    command: 'du -sh */ | sort -h',
  },
  {
    caption: 'Which process is writing to disk?',
    command: 'sudo iotop -o',
    note: 'iotop may need a package install',
  },
];

export const searchCommands: LinuxCommand[] = [
  {
    caption: 'Find files by name',
    command: 'find . -name "*.log" -type f',
  },
  {
    caption: 'Find + delete (in one pass)',
    command: 'find . -name "*.tmp" -type f -delete',
  },
  {
    caption: 'Case-insensitive recursive grep',
    command: 'grep -riI "TODO" src/',
    note: '-I skips binary files',
  },
  {
    caption: 'Grep with surrounding lines',
    command: 'grep -n -B 2 -A 2 "ERROR" app.log',
  },
  {
    caption: 'sed — in-place substitute',
    command: "sed -i 's/foo/bar/g' config.yaml",
    note: 'GNU sed. BSD (macOS) sed requires: sed -i \'\' ...',
  },
  {
    caption: "awk — print a column",
    command: "ps auxf | awk '{print $2, $11}'",
  },
];

export const permissions: Permission[] = [
  { symbolic: 'rwx------', octal: '700', meaning: 'Owner full; group/other nothing' },
  { symbolic: 'rwxr-xr-x', octal: '755', meaning: 'Owner full; others read + execute (typical for scripts, binaries)' },
  { symbolic: 'rw-r--r--', octal: '644', meaning: 'Owner read/write; others read (typical for config files)' },
  { symbolic: 'rw-------', octal: '600', meaning: 'Owner read/write only (SSH keys, secrets)' },
  { symbolic: 'rwxrwxrwx', octal: '777', meaning: 'Everyone everything — almost always wrong' },
];

export const fileDescriptorsNote = {
  summary:
    'Every open resource (file, socket, pipe, TTY) is a file descriptor — an integer index into a per-process table. 0=stdin, 1=stdout, 2=stderr are fixed; the rest are allocated as low as possible on open.',
  redirects: [
    { shape: '> file', meaning: 'Redirect stdout (fd 1) to file, truncate' },
    { shape: '>> file', meaning: 'Redirect stdout, append' },
    { shape: '2> file', meaning: 'Redirect stderr (fd 2)' },
    { shape: '2>&1', meaning: 'Merge stderr into stdout — usually written after other redirects' },
    { shape: '&> file', meaning: 'Shorthand for both stdout and stderr to file (bash)' },
    { shape: '< file', meaning: 'Use file as stdin (fd 0)' },
    { shape: 'cmd1 | cmd2', meaning: 'Pipe: stdout of cmd1 becomes stdin of cmd2' },
    { shape: '2>/dev/null', meaning: 'Discard stderr' },
    { shape: 'cmd <(other)', meaning: 'Process substitution — feed the output of `other` as if it were a file' },
  ],
  pitfall:
    'Order matters: `cmd > out 2>&1` redirects stdout to `out` then points stderr at "wherever stdout currently goes" — so both land in `out`. `cmd 2>&1 > out` does the opposite: stderr ends up on the terminal; stdout goes to `out`.',
};
