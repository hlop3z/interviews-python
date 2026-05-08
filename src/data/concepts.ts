import type { ConceptGroups } from './types';

export const concepts: ConceptGroups = {
  oop: [
    {
      name: 'Object',
      description: 'An instance of a class that encapsulates data and behavior.',
    },
    {
      name: 'Class',
      description: 'A blueprint for creating objects, defining their attributes (data) and methods (behavior).',
    },
    {
      name: 'Inheritance',
      description: 'A mechanism in OOP that allows a class to inherit properties and behaviors from another class, promoting code reusability and establishing a parent-child relationship.',
    },
    {
      name: 'Polymorphism',
      description: 'The ability for objects of different classes to be treated as objects of a common superclass, enabling methods to be invoked dynamically based on the type of object.',
    },
    {
      name: 'Abstraction',
      description: 'The process of hiding complex implementation details and exposing only the essential features of an object, making it easier to understand and use.',
    },
    {
      name: 'Encapsulation',
      description: 'The bundling of data and methods within a class, restricting access to the internal state of an object and promoting data integrity by controlling how data is accessed and modified.',
    },
  ],
  solid: [
    {
      name: 'Single Responsibility',
      description: 'A class should have only one reason to change, meaning it should have only one responsibility or job.',
    },
    {
      name: 'Open / Closed',
      description: 'Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification, allowing new functionality to be added without altering existing code.',
    },
    {
      name: 'Liskov Substitution',
      description: 'Objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.',
    },
    {
      name: 'Interface Segregation',
      description: 'Clients should not be forced to depend on interfaces they do not use. Instead, interfaces should be specific to the needs of the client.',
    },
    {
      name: 'Dependency Inversion',
      description: 'High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions.',
    },
  ],
  design: [
    {
      name: 'Singleton',
      description: 'Ensures that a class has only one instance and provides a global point of access to that instance.',
    },
    {
      name: 'Factory Method',
      description: 'Defines an interface for creating an object but allows subclasses to alter the type of objects that will be created.',
    },
    {
      name: 'Abstract Factory',
      description: 'Provides an interface for creating families of related or dependent objects without specifying their concrete classes.',
    },
    {
      name: 'Builder',
      description: 'Separates the construction of a complex object from its representation, allowing the same construction process to create different representations.',
    },
    {
      name: 'Prototype',
      description: 'Creates new objects by copying an existing object, typically used when the creation of a new instance is more efficient than creating it from scratch or with initial parameters.',
    },
    {
      name: 'Adapter',
      description: 'Allows incompatible interfaces to work together by providing a bridge between them.',
    },
    {
      name: 'Decorator',
      description: 'Attaches additional responsibilities to an object dynamically, providing a flexible alternative to subclassing for extending functionality.',
    },
    {
      name: 'Observer',
      description: 'Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.',
    },
    {
      name: 'Strategy',
      description: 'Defines a family of algorithms, encapsulates each one, and makes them interchangeable.',
    },
    {
      name: 'Command',
      description: 'Encapsulates a request as an object, thereby allowing for parameterization of clients with queues, requests, and operations.',
    },
  ],
  paradigms: [
    {
      name: 'Procedural Programming',
      description: 'Focuses on procedures or routines to execute a series of computational steps.',
    },
    {
      name: 'Object-Oriented Programming (OOP)',
      description: 'Organizes software design around objects that encapsulate data and behavior.',
    },
    {
      name: 'Functional Programming',
      description: 'Emphasizes the use of pure functions and immutable data to model computation.',
    },
    {
      name: 'Imperative Programming',
      description: 'Specifies a series of statements that change a program\'s state.',
    },
    {
      name: 'Declarative Programming',
      description: 'Describes what the program should accomplish rather than how to achieve it, allowing for a more abstract approach.',
    },
    {
      name: 'Event-Driven Programming',
      description: 'Relies on events triggered by user actions or system events to determine program flow.',
    },
    {
      name: 'Aspect-Oriented Programming (AOP)',
      description: 'Separates cross-cutting concerns (such as logging or security) from the main application logic.',
    },
    {
      name: 'Reactive Programming',
      description: 'Deals with asynchronous data streams and the propagation of changes, allowing for reactive and scalable systems.',
    },
    {
      name: 'Actor Model',
      description: 'Models concurrent computation as a collection of actors that communicate via asynchronous messages.',
    },
    {
      name: 'Distributed Computing',
      description: 'Designs software to run across multiple interconnected computers, enabling scalability and fault tolerance.',
    },
  ],
  architectures: [
    {
      name: 'Monolithic',
      description: 'Single, unified codebase deployed as one unit — simple to start, harder to scale and evolve independently as it grows.',
    },
    {
      name: 'Layered (N-Tier)',
      description: 'Organizes the system into horizontal layers (presentation, business, data); each layer only depends on the one directly below it.',
    },
    {
      name: 'Client-Server',
      description: 'Splits responsibility between requesters (clients) and providers (servers) communicating over a network.',
    },
    {
      name: 'Model-View-Controller (MVC)',
      description: 'Separates the application into three interconnected components: Model (data), View (user interface), and Controller (logic).',
    },
    {
      name: 'Model-View-ViewModel (MVVM)',
      description: 'A variation of MVC where the ViewModel mediates communication between the View and Model, enabling data binding in UI frameworks.',
    },
    {
      name: 'Hexagonal (Ports & Adapters)',
      description: 'Isolates core domain logic from external concerns via ports (interfaces) and adapters (implementations), keeping the core independent of frameworks, UI, and databases.',
    },
    {
      name: 'Onion Architecture',
      description: 'Concentric layers around a domain core with dependencies pointing inward only — outer layers depend on inner ones, never the reverse.',
    },
    {
      name: 'Clean Architecture',
      description: 'Robert Martin\'s synthesis of hexagonal and onion: entities at the center, use cases around them, and the Dependency Rule enforcing inward-pointing dependencies.',
    },
    {
      name: 'Component-Based',
      description: 'Constructs software from reusable, self-contained components with well-defined interfaces.',
    },
    {
      name: 'Service-Oriented Architecture (SOA)',
      description: 'Designs software as a collection of coarse-grained services that communicate through standardized protocols, often via an enterprise service bus.',
    },
    {
      name: 'Microservices',
      description: 'Decomposes the application into small, independently deployable services that own their data and communicate over the network.',
    },
    {
      name: 'Service-Oriented Integration (SOI)',
      description: 'Integrates disparate systems by exposing capabilities as services through well-defined interfaces.',
    },
    {
      name: 'Serverless',
      description: 'Application logic runs as ephemeral, event-driven functions on managed infrastructure, with no server provisioning or capacity planning.',
    },
    {
      name: 'Event-Driven Architecture (EDA)',
      description: 'Components communicate by producing and consuming events asynchronously, decoupling producers from consumers in time and identity.',
    },
    {
      name: 'Event Sourcing',
      description: 'Persists application state as an append-only log of events; current state is derived by replaying them, enabling full audit and time travel.',
    },
    {
      name: 'CQRS (Command Query Responsibility Segregation)',
      description: 'Separates read and write models so each side can be optimized, scaled, and evolved independently.',
    },
    {
      name: 'Pipes and Filters',
      description: 'Processes data through a sequence of independent transformation stages (filters) connected by pipes, each stage doing one thing.',
    },
    {
      name: 'Space-Based',
      description: 'Removes the central database bottleneck by distributing state across an in-memory data grid; processing units scale horizontally for high-load systems.',
    },
    {
      name: 'Domain-Driven Design (DDD)',
      description: 'Models software around a rich understanding of the business domain, using ubiquitous language and bounded contexts to align code with the problem space.',
    },
    {
      name: 'Model-Driven Architecture (MDA)',
      description: 'Treats models as the primary development artifacts, generating code from platform-independent and platform-specific models.',
    },
  ],
  principles: [
    {
      name: 'Modularity',
      description: 'Divide the software into separate modules to enhance maintainability, reusability, and scalability.',
    },
    {
      name: 'Decoupling',
      description: 'Minimize dependencies between modules or components to improve flexibility and facilitate easier updates or replacements.',
    },
    {
      name: 'SoC (Separation of Concerns)',
      description: 'Divide a software system into distinct sections, each addressing a separate concern, to improve readability and maintainability.',
    },
    {
      name: 'KISS (Keep It Simple, Stupid)',
      description: 'Strive for simplicity in design and implementation, avoiding unnecessary complexity that can lead to confusion and maintenance difficulties.',
    },
    {
      name: 'DRY (Don\'t Repeat Yourself)',
      description: 'Eliminate redundancy in code by abstracting common functionalities into reusable components, reducing the risk of errors and improving maintainability.',
    },
    {
      name: 'YAGNI (You Aren\'t Gonna Need It)',
      description: 'Avoid implementing features or functionalities until they are actually needed, preventing unnecessary complexity and over-engineering.',
    },
    {
      name: 'Fail-Fast',
      description: 'Detect and report errors as soon as possible to prevent them from propagating and causing further issues, facilitating faster debugging and resolution.',
    },
    {
      name: 'Convention Over Configuration',
      description: 'Use sensible defaults and conventions to minimize the need for explicit configuration, promoting consistency and reducing cognitive load.',
    },
  ],
};
