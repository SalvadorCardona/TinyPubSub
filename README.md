# Simple PubSub

A lightweight and type-safe publish/subscribe library for JavaScript and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Vanilla JavaScript/TypeScript](#vanilla-javascripttypescript)
  - [1. Simple PubSub](#1-simple-pubsub)
    - [Import](#import)
    - [Creating an instance](#creating-an-instance)
    - [Subscribing to events](#subscribing-to-events)
    - [Publishing events](#publishing-events)
    - [Unsubscribing](#unsubscribing)
    - [Complete example](#complete-example)
  - [2. PubSub with Channels](#2-pubsub-with-channels)
    - [Import](#import-1)
    - [Creating an instance](#creating-an-instance-1)
    - [Subscribing to a channel](#subscribing-to-a-channel)
    - [Subscribing to all channels](#subscribing-to-all-channels)
    - [Publishing to a channel](#publishing-to-a-channel)
    - [Unsubscribing](#unsubscribing-1)
    - [Complete example](#complete-example-1)
- [React with useEffect](#react-with-useeffect)
  - [1. Simple PubSub with React](#1-simple-pubsub-with-react)
    - [Custom hook (recommended)](#custom-hook-recommended)
    - [Direct usage with useEffect](#direct-usage-with-useeffect)

## Installation

```shell
npm i stupid-pub-sub
```

### 1. Simple PubSub

The `createPubSub` allows you to create a simple publish/subscribe system.

#### Import
```typescript
import { createPubSub } from 'simple-pubsub'
```
#### Creating an instance
```typescript
// Without typing
const pubsub = createPubSub()

// With TypeScript typing
interface UserData {
  id: number
  name: string
}

const pubsub = createPubSub<UserData>()
```
#### Subscribing to events
```typescript
const subscription = pubsub.subscribe((data) => {
  console.log('Data received:', data)
})

// subscription contains:
// - id: the unique identifier of the subscription
// - unsubscribe: function to unsubscribe
```
#### Publishing events
```typescript
pubsub.publish({ id: 1, name: 'John' })
```
#### Unsubscribing
```typescript
// Method 1: via the returned object
subscription.unsubscribe()

// Method 2: via the ID
pubsub.unsubscribe(subscription.id)
```
#### Complete example
```typescript
import { createPubSub } from 'simple-pubsub'

interface Message {
  text: string
  timestamp: number
}

const messageBus = createPubSub<Message>()

// Subscription 1
const sub1 = messageBus.subscribe((msg) => {
  console.log('Handler 1:', msg.text)
})

// Subscription 2
const sub2 = messageBus.subscribe((msg) => {
  console.log('Handler 2:', msg.text)
})

// Publish a message
messageBus.publish({
  text: 'Hello World',
  timestamp: Date.now()
})

// Unsubscribe
sub1.unsubscribe()
```
---

### 2. PubSub with Channels

The `createChannelPubSub` allows you to manage multiple communication channels.

#### Import

```typescript
import { createChannelPubSub } from 'simple-pubsub'
```

#### Creating an instance

#### Creating an instance

```typescript
const channelBus = createChannelPubSub<any>()

// With typing
interface Notification {
  type: string
  message: string
}

const channelBus = createChannelPubSub<Notification>()
```

#### Subscribing to a channel

```typescript
const subscription = channelBus.subscribe('notifications', (data) => {
  console.log('Notification received:', data)
})

// subscription contains:
// - id: the subscription identifier
// - channel: the channel name
// - unsubscribe: function to unsubscribe
```

#### Subscribing to all channels

```typescript
const allSubscription = channelBus.subscribe('all', (data) => {
  console.log('Event on any channel:', data)
})
```

#### Publishing to a channel

```typescript
channelBus.publish('notifications', {
  type: 'info',
  message: 'New notification'
})
```

#### Unsubscribing

```typescript
// Method 1: via the returned object
subscription.unsubscribe()

// Method 2: via the channel and ID
channelBus.unsubscribe('notifications', subscription.id)
```

#### Complete example

```typescript
import { createChannelPubSub } from 'simple-pubsub'

const eventBus = createChannelPubSub()

// Subscribe to different channels
const userSub = eventBus.subscribe('user', (data) => {
  console.log('User event:', data)
})

const orderSub = eventBus.subscribe('order', (data) => {
  console.log('Order event:', data)
})

// Subscribe to all events
const allSub = eventBus.subscribe('all', (data) => {
  console.log('Global event:', data)
})

// Publish to different channels
eventBus.publish('user', { action: 'login', userId: 123 })
eventBus.publish('order', { action: 'created', orderId: 456 })

// Cleanup
userSub.unsubscribe()
orderSub.unsubscribe()
allSub.unsubscribe()
```

---

## React with useEffect

### 1. Simple PubSub with React

#### Custom hook (recommended)

```tsx
import type { Index } from 'simple-pubsub'
import { useEffect } from 'react'
import { createPubSub } from 'simple-pubsub'

// Create the instance outside the component
const messageBus = createPubSub<string>()

function usePubSub<T>(pubsub: Index<T>, handler: (data: T) => void) {
  useEffect(() => {
    const subscription = pubsub.subscribe(handler)

    // Cleanup: unsubscribe on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [pubsub, handler])
}

// Usage in a component
function MessageDisplay() {
  usePubSub(messageBus, (message) => {
    console.log('Message received:', message)
  })

  return <div>Check console</div>
}

function MessageSender() {
  const sendMessage = () => {
    messageBus.publish('Hello from sender!')
  }

  return <button onClick={sendMessage}>Send Message</button>
}
```

#### Direct usage with useEffect

```tsx
import { useEffect, useState } from 'react'
import { createPubSub } from 'simple-pubsub'

interface Message {
  text: string
  timestamp: number
}

// Global instance
const messageBus = createPubSub<Message>()

function MessageListener() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const subscription = messageBus.subscribe((message) => {
      setMessages(prev => [...prev, message])
    })

    // Automatic cleanup on component unmount
    return () => {
      subscription.unsubscribe()
    }
  }, []) // Empty array = runs only once on mount

  return (
    <div>
      <h2>Messages received:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.text}
            {' '}
            -
            {' '}
            {new Date(msg.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

function MessagePublisher() {
  const handleSend = () => {
    messageBus.publish({
      text: 'Hello World',
      timestamp: Date.now()
    })
  }

  return <button onClick={handleSend}>Send a message</button>
}

export { messageBus, MessageListener, MessagePublisher }
```
