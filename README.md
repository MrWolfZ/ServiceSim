Design thoughts:

- distinguish between engine config, engine runtime, and transient aggregates
- use strategy to manage each type of document, e.g. LocalDevelopmentEngineConfigurationPersistenceStrategy, DeployedInstance[...], DemoInstance[...]
- each strategy uses persistence adapters, e.g. ConfigurationSourceAdapter, ConfigurationVersionStorageAdapter, TransactionalPersistenceAdapter
- support local demo versions by using a local storage persistence strategy
- don't publish data events for configuration documents and transient documents
- update aggregates and dispatch events explicitly instead of doing it implicitly inside the persistence layer
- move infrastructure part of application into infrastructure
