// Senior-grade Python topics that come up in backend interviews — typing,
// dataclass comparisons, context managers, descriptors, generators, footguns.
// Concurrency / asyncio live on the dedicated concurrency page; this file
// deliberately doesn't duplicate them.

export interface TypingFeature {
  feature: string;
  purpose: string;
  example: string;
}

export const typingFeatures: TypingFeature[] = [
  {
    feature: 'TypeVar',
    purpose: 'Parametric generics — a function/class that works for any type but preserves it.',
    example: 'T = TypeVar("T"); def first(xs: list[T]) -> T: ...',
  },
  {
    feature: 'Generic[T]',
    purpose: 'Make a class generic over a type.',
    example: 'class Box(Generic[T]): def __init__(self, v: T): self.v = v',
  },
  {
    feature: 'Protocol',
    purpose: 'Structural typing — duck typing with static checks (PEP 544).',
    example: 'class Drawable(Protocol): def draw(self) -> None: ...',
  },
  {
    feature: 'Literal',
    purpose: 'Constrain a value to a specific set of literals.',
    example: 'def log(level: Literal["info", "warn", "error"]): ...',
  },
  {
    feature: 'TypedDict',
    purpose: 'Type dict-shaped payloads (API responses, JSON) with static checks.',
    example: 'class User(TypedDict): id: int; name: str',
  },
  {
    feature: 'NewType',
    purpose: 'Distinct nominal alias — UserId is not Int at the type level.',
    example: 'UserId = NewType("UserId", int)',
  },
  {
    feature: 'Final',
    purpose: 'Prevent reassignment / subclass override.',
    example: 'MAX_RETRIES: Final[int] = 3',
  },
  {
    feature: 'Variance (covariance/contravariance)',
    purpose: 'list[Dog] is NOT a list[Animal] (invariant). Sequence[Dog] IS a Sequence[Animal] (covariant).',
    example: 'T_co = TypeVar("T_co", covariant=True)',
  },
  {
    feature: 'Optional / Union',
    purpose: '`X | None` (3.10+) or `Optional[X]`. Union is `A | B`.',
    example: 'def get(id: int) -> User | None: ...',
  },
  {
    feature: 'ParamSpec',
    purpose: 'Preserve function signatures across decorators.',
    example: 'P = ParamSpec("P"); def log(f: Callable[P, R]) -> Callable[P, R]: ...',
  },
];

export interface DataShape {
  name: string;
  immutable: string;
  validation: string;
  perf: string;
  useWhen: string;
}

export const dataShapes: DataShape[] = [
  {
    name: 'NamedTuple',
    immutable: 'Immutable (tuple underneath)',
    validation: 'None',
    perf: 'Fastest; smallest memory.',
    useWhen: 'Tiny value objects; return types; fixed-shape records.',
  },
  {
    name: '@dataclass',
    immutable: 'Mutable by default; `frozen=True` makes immutable.',
    validation: 'None (just types as hints, not enforced at runtime).',
    perf: 'Fast; built-in; stdlib.',
    useWhen: 'Domain entities, DTOs inside your code, anything not crossing a boundary.',
  },
  {
    name: '@dataclass(slots=True)',
    immutable: 'Same as dataclass',
    validation: 'None',
    perf: 'Lower memory (~40% smaller); faster attribute access. No __dict__.',
    useWhen: 'You instantiate millions of instances and RAM matters.',
  },
  {
    name: 'attrs',
    immutable: 'Configurable',
    validation: 'Validators per field; converters.',
    perf: 'Close to dataclass; mature ecosystem.',
    useWhen: 'You want dataclass features + validators and predate Pydantic.',
  },
  {
    name: 'Pydantic v2',
    immutable: 'Configurable (`model_config = {"frozen": True}`)',
    validation: 'Rigorous runtime validation + coercion. Rust-backed core.',
    perf: 'Slower instantiation than dataclass; fast JSON (orjson).',
    useWhen: 'Data crossing a boundary — HTTP bodies, config, queue messages, LLM IO.',
  },
];

export const dataShapeRule =
  'dataclass inside, Pydantic at the edge. Use dataclass for domain objects that stay in your process; use Pydantic where untrusted data enters or leaves (HTTP, queue, config, DB-adjacent boundaries).';

export interface ContextManagerRecipe {
  name: string;
  snippet: string;
  note: string;
}

export const contextManagers: ContextManagerRecipe[] = [
  {
    name: 'Class-based',
    snippet: `class Session:
    def __enter__(self):
        self.conn = open_conn()
        return self.conn
    def __exit__(self, exc_type, exc, tb):
        self.conn.close()`,
    note: 'Full control. Return self or the underlying resource from __enter__.',
  },
  {
    name: '@contextmanager',
    snippet: `from contextlib import contextmanager

@contextmanager
def session():
    conn = open_conn()
    try:
        yield conn
    finally:
        conn.close()`,
    note: 'Most common. The yield line is the "body of the with block."',
  },
  {
    name: 'ExitStack',
    snippet: `from contextlib import ExitStack

with ExitStack() as stack:
    files = [stack.enter_context(open(p)) for p in paths]`,
    note: 'Dynamic number of context managers; clean up all on exit.',
  },
  {
    name: 'suppress',
    snippet: `from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove(path)`,
    note: 'Readable alternative to `try: ... except X: pass`.',
  },
  {
    name: 'async context manager',
    snippet: `class AsyncSession:
    async def __aenter__(self): ...
    async def __aexit__(self, et, e, tb): ...

# usage
async with AsyncSession() as s: ...`,
    note: 'For any resource acquired via await (DB pool, HTTP client).',
  },
];

export interface GeneratorPattern {
  name: string;
  use: string;
  snippet: string;
}

export const generatorPatterns: GeneratorPattern[] = [
  {
    name: 'Basic generator',
    use: 'Lazy iteration, constant memory even over huge sequences.',
    snippet: `def lines(path):
    with open(path) as f:
        for line in f:
            yield line.rstrip()`,
  },
  {
    name: 'yield from',
    use: 'Delegate to a sub-generator; preserves send / throw.',
    snippet: `def flatten(seq):
    for x in seq:
        if isinstance(x, list):
            yield from flatten(x)
        else:
            yield x`,
  },
  {
    name: 'Generator expression',
    use: 'Inline pipeline; beats list comprehension when only iterated once.',
    snippet: `total = sum(len(line) for line in lines(path))`,
  },
  {
    name: 'Send + state machine',
    use: 'Coroutine-shaped generator; external driver injects values.',
    snippet: `def averaging():
    total, n = 0, 0
    while True:
        x = yield total / n if n else 0
        total, n = total + x, n + 1

avg = averaging(); next(avg)
avg.send(10); avg.send(20)`,
  },
  {
    name: 'itertools power tools',
    use: 'Compose iterators without intermediate lists.',
    snippet: `import itertools as it
# chain, groupby, islice, chain, takewhile, accumulate, pairwise (3.10+)
first_n = list(it.islice(stream, 100))`,
  },
];

export interface DescriptorFact {
  name: string;
  why: string;
}

export const descriptorFacts: DescriptorFact[] = [
  {
    name: 'Descriptor protocol',
    why: 'An object with `__get__` / `__set__` / `__delete__`. Bound methods, @property, @classmethod, @staticmethod, slots, Django fields — all descriptors.',
  },
  {
    name: '@property',
    why: 'Computed attribute. Read `obj.attr`, runs a method. Only reach for it when a hidden computation is cheap.',
  },
  {
    name: 'cached_property',
    why: 'Like property but computes once and caches on the instance. Great for derived fields on a dataclass.',
  },
  {
    name: 'Metaclass',
    why: 'The class of a class. You almost never need one; ABC, @dataclass, and __init_subclass__ cover 99% of cases.',
  },
  {
    name: '__init_subclass__',
    why: 'Hook called when a class is subclassed. Cleaner than a metaclass for registries and validation.',
  },
];

export interface Footgun {
  name: string;
  code: string;
  fix: string;
}

export const footguns: Footgun[] = [
  {
    name: 'Mutable default argument',
    code: `def append(x, xs=[]):  # shared across calls!
    xs.append(x); return xs`,
    fix: 'Default to None; build inside. `def append(x, xs=None): xs = [] if xs is None else xs; ...`',
  },
  {
    name: 'Late binding in closures',
    code: `fns = [lambda: i for i in range(3)]
# all fns return 2, not 0, 1, 2`,
    fix: 'Capture via default arg: `[lambda i=i: i for i in range(3)]`, or use `functools.partial`.',
  },
  {
    name: 'is vs ==',
    code: `a = 257; b = 257
a is b  # False (CPython caches only -5..256)`,
    fix: 'Use `==` for value equality. `is` is for identity (None, sentinels).',
  },
  {
    name: 'Copying vs aliasing',
    code: `a = [1, 2]; b = a; b.append(3)
# a is now [1, 2, 3]`,
    fix: '`b = a.copy()` or `b = list(a)`. For nested, `copy.deepcopy`.',
  },
  {
    name: 'Integer division in Python 2 habits',
    code: `5 / 2  # 2.5 in Py3, not 2`,
    fix: 'Use `//` for floor division explicitly. Guard against accidental float in money code.',
  },
  {
    name: 'Dict ordering assumptions',
    code: `# Pre-3.7: dict order was not guaranteed.`,
    fix: '3.7+: dict preserves insertion order. Still avoid relying on order for logic.',
  },
  {
    name: 'except: with no class',
    code: `try: ...
except: pass  # catches KeyboardInterrupt too`,
    fix: 'Always name exceptions. `except Exception:` at worst.',
  },
  {
    name: 'f-string vs .format for user input',
    code: `user_input = "{secret}"
user_input.format(secret=SECRET)  # leaks SECRET`,
    fix: 'Never call .format on attacker-controlled strings. Prefer f-strings (evaluated at write-time).',
  },
];

export const interviewProbes = [
  'What does the GIL actually serialize, and when does it release? → see Concurrency page.',
  'Difference between @classmethod, @staticmethod, and a plain method? (receiver, binding)',
  'How does `x is y` differ from `x == y`? (identity vs equality)',
  'Show me how you would implement a context manager two ways.',
  'What is `__slots__` and when is it worth it? (memory, no __dict__, inheritance rules)',
  'When would you pick Pydantic over dataclass, and vice versa?',
  'How do generators help with memory? Give an example of a useful generator pipeline.',
];
