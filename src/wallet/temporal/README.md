# Background Workflows and Activities with Temporal

## Overview
Background workflows/tasks/jobs are a critical part of any stack. They offload long-running tasks, enabling queuing, load distribution, failsafe retries, etc.

?> For a more in-depth view of Temporal, see [this tutorial](https://docs.temporal.io/docs/temporal-explained/introduction).

In Temporal, implementing a background workflow involves creating and configuring the following artifacts, explained in detail below.

1. Activities
2. Workflows
3. Workers
4. The worker core
5. The Temporal client

This guide describes how to integrate a workflow into a Nest module and invoke it.

## Quick guide
If you're familiar with Temporal, here's the quick version of how to set up some workflows:

1. Set up directory structure
2. Define your activities and workflows
3. Define the worker, including its task queue
4. Add the activity provider and worker as providers in `module.ts`
5. Import `TemporalModule` into `module.ts`
6. Inject the Temporal WorkflowClient (name: `TEMPORAL_CLIENT`) wherever it's needed and start your workflows

## Directory structure
First, create a directory within your module for temporal activities and workflows. Files explained below. 

```
module
`- temporal
   |- activities.ts
   |- worker.ts
   `- workflows
      |- index.ts
      `- workflows.ts
```

## Activities
Activities do the main work. These are where you interface with your system, and they can modify state. Use them for db queries, 3rd party service calls, etc. Think of an activity as _something that might fail_. Activities should generally not be focused on business logic (that's for Workflows). Temporal will retry your activity functions until they complete without error.

Here's a very simple `activities.ts` file:

```typescript
export const ActivityFactory = (userRepository: UserRepository) => ({
    sayHello: async (userId: string) => {
        const user = await userRepository.find(userId);
        return `Hello, ${user.firstName} ${user.lastName}!`;
    },
});

// Provider to make activities available within Nest's DI context
export const ActivityProvider: FactoryProvider = {
    provide: "ACTIVITIES_PROVIDER",
    inject: [UserRepository],
    useFactory: ActivityFactory,
};
```

Note:
* We're using FactoryProvider to hook into Nest.js. This lets us inject anything we need, in this case `UserRepository`.
* `ActivityFactory` just has to return an object with functions. You can define functions inline or reference them from other locations, but you must have one single object when done.

Register the `ActivityProvider` object as a provider in your Nest module:
```typescript
@Module({
    imports: [UsersModule, TemporalModule],
    providers: [ActivityProvider, ChatWorker, TemporalUserEventListener, /* ... other providers*/ ],
    exports: [ChatService],
})
export class ChatModule {}

```

## Workflows
Workflows are the main thing you'll interact with in Temporal. You can start or stop a workflow, and, once running, Temporal ensures your workflow will run to completion. You can think of them like a job or task in other frameworks. They express your business logic.

Workflows are durable, in that they survive service restarts and crashes, and pick up where they left off. Because of this, Workflows _must not have side effects_. They may only execute simple code and `await` activities, which is where side effects may happen.

Workflows also run in a separate VM to isolate them from side effects, which is why your workflow code must be bundled into a webpack that the VM can execute. We'll see how this works in a moment.

Example workflow:
```typescript
import { proxyActivities } from "@temporalio/workflow";

const { sayHello } = proxyActivities<ReturnType<typeof ActivityFactory>>({
  startToCloseTimeout: "30 seconds",
  retry: { initialInterval: "2s", backoffCoefficient: 2 },
});

export async function greetUser(user: User): Promise<void> {
  await sayHello(user);
}
```

You can use one file per workflow (encouraged), but must export all workflows in `index.ts` too so that they become part of the bundle.

Note:
* `greetUser` is the workflow in this case
* We bring in _proxied activities_ using the ActivityFactory's type. The proxy handles server communication and retries.
* You must use a plain function (not a class)
* This is where we configure retries and timeouts for each activity

## Workers
A worker is what runs your workflows. They aren't particularly special, they just bring together activities and workflows and begin polling for tasks to run. As such, a Worker is mainly a place to house configuration and provide something to start and stop.

Example worker:
```typescript
import { Inject, Injectable } from "@nestjs/common";

import { ActivityInterface } from "@temporalio/workflow";
import { BaseTemporalWorker, WorkerConfigFactory } from "core/temporal";

export const CHAT_TASK_QUEUE = "chat";

@Injectable()
export class ChatWorker extends BaseTemporalWorker {
  constructor(
    @Inject("ACTIVITIES_PROVIDER") private readonly activities: ActivityInterface,
    configFactory: WorkerConfigFactory
  ) {
    super();

    this.config = configFactory.createConfig(activities, __dirname + "/workflows", CHAT_TASK_QUEUE, { /* custom worker options */ });
  }
}
```
 Note:
 * The worker extends `BaseTemporalWorker` and uses a `WorkerConfigFactory`. This is mainly to reduce boilerplate.
 * The `__dirname + "/workflows"` defines the path to bundle. It must either be an absolute path (as shown), or be relative to `BaseTemporalWorker`.
 * You must define the task queue to poll. When starting a workflow, you must give it the same task queue name.
   * Temporal creates queues automatically, so just naming them is all that's needed

## The Worker Core
This is a singleton for the entire app and controls where and how workers connect to Temporal. You should not need to modify it, but if needed see `worker-core.ts` in the Temporal module (`src/core/temporal`).

## The Temporal Workflow Client
Finally, the Workflow Client is how you interact with the Temporal server. It's globally configured in the Temporal module (like the worker core). Inject and use to start a workflow or any other needed operation.

## Starting a workflow

Here's an example event listener that starts a workflow:

```typescript
import { WorkflowClient } from "@temporalio/client";

import { UserCreatedEvent } from "../users/events/user-created.event";
import { CHAT_TASK_QUEUE } from "./temporal/worker";
import { greetUser } from "./temporal/workflows";

@Injectable()
export class TemporalUserEventListener {

  constructor(@Inject("TEMPORAL_CLIENT") private readonly temporalClient: WorkflowClient) {}

  @OnEvent(UserCreatedEvent)
  async handleUserCreatedEvent(event: UserCreatedEvent, metadata: EventMetadata) {
    const handle = await this.temporalClient.start(greetUser, {
        args: [event.user], // type inference works!
        taskQueue: CHAT_TASK_QUEUE,
        // Use a meaningful business id
        workflowId: "UserCreated_greet_" + event.user.id,
    });
  }
}
```
Note:
* Once you start a workflow, you get a _handle_ back. This lets you interact with the workflow: start, stop, signal, query, etc.
  * You get a handle by workflow id or name at any time, it's not required that you start one
* Use a meaningful id for the workflow. Usually these associate with the main entity they operate on. It should be appropriately unique for your problem.
