
export interface Material {
  slug: string;
  title: string;
  description: string;
  category: 'Behavioral' | 'Technical' | 'System Design';
  content: string;
}

export const materials: Material[] = [
  {
    slug: 'star-method',
    title: 'Mastering the STAR Method for Behavioral Questions',
    description: 'Learn how to structure your answers to behavioral questions effectively using the STAR method.',
    category: 'Behavioral',
    content: `
## Mastering the STAR Method

The STAR method is a structured manner of responding to a behavioral-based interview question by discussing the specific **Situation**, **Task**, **Action**, and **Result** of the situation you are describing.

### S - Situation
Describe the situation that you were in or the task that you needed to accomplish. You must describe a specific event or situation, not a generalized description of what you have done in the past. Be sure to give enough detail for the interviewer to understand. This situation can be from a previous job, a volunteer experience, or any relevant event.

*Example: "During my time as a project manager at XYZ Corp, we were facing a tight deadline for a major client's product launch. A critical bug was discovered in the final week before deployment, jeopardizing the entire timeline."*

### T - Task
What was your goal in this situation? Describe what you were responsible for in that situation.

*Example: "My task was to assess the bug's impact, coordinate the development team for a rapid fix, and communicate the updated timeline to the client without losing their confidence."*

### A - Action
Describe the actions you took to address the situation with an appropriate amount of detail and keep the focus on YOU. What specific steps did you take and what was your particular contribution? Be careful that you don’t describe what the team or group did when talking about a project, but what you actually did. Use the word “I,” not “we,” when describing your actions.

*Example: "First, I immediately convened a meeting with the lead developer and QA engineer to reproduce the bug and triage its severity. I determined it was a high-priority issue but could be resolved with a focused effort. I then created a detailed action plan, re-assigning two developers to work exclusively on the fix. Concurrently, I drafted a transparent communication for the client, outlining the issue, our action plan, and a revised, realistic launch date just two days later than originally planned. I presented this to our account manager to deliver to the client."*

### R - Result
Describe the outcome of your actions. What happened? How did the event end? What did you accomplish? What did you learn?

*Example: "As a result, the team was ableto patch, test, and deploy the fix within 36 hours. We met the revised launch date, and the client was impressed with our proactive communication and swift resolution, which actually strengthened our relationship. The project was a success, and we implemented a new pre-deployment testing phase to prevent similar issues in the future."*
`
  },
  {
    slug: 'big-o-notation',
    title: 'Understanding Big O Notation',
    description: 'A primer on Big O notation to help you analyze algorithm efficiency.',
    category: 'Technical',
    content: `
## A Primer on Big O Notation

Big O notation is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity. In computer science, Big O notation is used to classify algorithms according to how their run time or space requirements grow as the input size grows.

### O(1) - Constant Time
An algorithm is said to have constant time when it is not dependent on the input data (n). No matter the size of the input data, the execution time will be constant.

*Example: Accessing an element in an array by its index.*
\`\`\`javascript
function getFirst(arr) {
  return arr[0];
}
\`\`\`

### O(n) - Linear Time
An algorithm is said to have a linear time complexity when the running time increases at most linearly with the size of the input data.

*Example: Iterating through an array to find an element.*
\`\`\`javascript
function findValue(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return i; // Found
    }
  }
  return -1; // Not found
}
\`\`\`

### O(n²) - Quadratic Time
An algorithm is said to have a quadratic time complexity when the running time grows quadratically with the size of the input. This is common with algorithms that involve nested iterations over the data set.

*Example: A simple bubble sort.*
\`\`\`javascript
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}
\`\`\`

### O(log n) - Logarithmic Time
An algorithm is said to have logarithmic time complexity if its time execution is proportional to the logarithm of the input size. This is typical for algorithms that divide the problem in half with each pass.

*Example: Binary search.*
\`\`\`javascript
function binarySearch(sortedArr, value) {
  let left = 0;
  let right = sortedArr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedArr[mid] === value) {
      return mid;
    } else if (sortedArr[mid] < value) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
\`\`\`
`
  },
  {
    slug: 'system-design-basics',
    title: 'Introduction to System Design Interviews',
    description: 'Key principles and a framework for approaching system design interview questions.',
    category: 'System Design',
    content: `
## Approaching System Design Interviews

System design interviews are open-ended conversations where you are expected to lead the design of a complex system. Here’s a framework to help you structure your approach.

### Step 1: Clarify Requirements & Scope
Don't jump into designing immediately. Spend the first few minutes understanding the problem.
- **Functional Requirements:** What must the system do? (e.g., "Users must be able to upload photos and view a news feed.")
- **Non-Functional Requirements:** What are the system's constraints and desired qualities?
  - **Scalability:** How many users will it support? (e.g., 10 million daily active users)
  - **Availability:** Does the system need to be highly available (e.g., 99.99% uptime)?
  - **Latency:** How fast should responses be? (e.g., "News feed must load in under 200ms.")
  - **Consistency:** Is strong consistency required, or is eventual consistency acceptable?

### Step 2: High-Level Design & Estimates
Draw a high-level architecture diagram. This includes major services and how they interact.
- **Back-of-the-envelope calculations:**
  - Estimate traffic (QPS - Queries Per Second).
  - Estimate storage needs (e.g., "If 10M users upload 1 photo/day at 2MB/photo, that's 20TB of new storage daily.").
  - Estimate bandwidth.

### Step 3: Deep Dive into Components
Choose one or two key components to design in more detail. This shows you can go from high-level to low-level.
- **API Design (REST/GraphQL):** Define the endpoints for your services.
- **Database Schema:** Choose a database type (SQL vs. NoSQL) and design the basic schema. Justify your choice. For example, a relational DB for user data with transactional needs, and a NoSQL DB for high-volume, unstructured data like social media posts.
- **Caching:** Where would you add a caching layer (like Redis or Memcached) to improve performance?
- **Load Balancing:** How would you distribute traffic across your servers?

### Step 4: Identify Bottlenecks & Scale
Discuss how your design would handle a massive increase in users or traffic.
- **Database Scaling:** Sharding, read replicas.
- **Service Scaling:** Stateless services, horizontal scaling.
- **Content Delivery Network (CDN):** For serving static assets like images and videos.
- **Message Queues (e.g., RabbitMQ, Kafka):** For decoupling services and handling asynchronous tasks.

Remember, the goal is not to produce a "perfect" design, but to demonstrate your thought process, trade-off considerations, and breadth of knowledge.
`
  },
  {
    slug: 'common-data-structures',
    title: 'Guide to Common Data Structures',
    description: 'An overview of essential data structures like Arrays, Linked Lists, and Hash Tables.',
    category: 'Technical',
    content: `
## Guide to Common Data Structures

Understanding data structures is fundamental to computer science and software engineering. They are the building blocks for efficient algorithms.

### 1. Arrays
An array is a collection of items stored at contiguous memory locations.
- **Strengths:** Fast access to elements via index (O(1)).
- **Weaknesses:** Slow to add or remove elements from the middle (O(n)). Size is often fixed.
- **Use Case:** Storing a collection of elements when you know the size and need fast lookups.

### 2. Linked Lists
A linked list is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next.
- **Strengths:** Fast to add or remove elements from any position (O(1) if you have the node).
- **Weaknesses:** Slow to access a specific element (O(n)), as you have to traverse the list from the beginning.
- **Use Case:** When you need to do a lot of insertions and deletions, like implementing a queue or a stack.

### 3. Stacks
A stack is a Last-In, First-Out (LIFO) data structure. The last element added is the first one to be removed.
- **Operations:** \`push\` (add to top), \`pop\` (remove from top), \`peek\` (view top element).
- **Use Case:** Managing function calls (the call stack), undo/redo functionality, parsing expressions.

### 4. Queues
A queue is a First-In, First-Out (FIFO) data structure. The first element added is the first one to be removed.
- **Operations:** \`enqueue\` (add to back), \`dequeue\` (remove from front).
- **Use Case:** Handling requests in order, breadth-first search in graphs, task scheduling.

### 5. Hash Tables (Hash Maps)
A hash table stores key-value pairs. It uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.
- **Strengths:** Very fast average time for insertion, deletion, and lookup (O(1)).
- **Weaknesses:** Worst-case time can be O(n) if many keys hash to the same bucket (collision). Keys are not ordered.
- **Use Case:** Implementing caches, database indexing, looking up dictionary-style data.
`
  },
  {
    slug: 'tell-me-about-yourself',
    title: 'Answering "Tell Me About Yourself"',
    description: 'A framework for crafting the perfect response to this common opening question.',
    category: 'Behavioral',
    content: `
## How to Answer "Tell Me About Yourself"

This is often the first question in an interview. It's your chance to set the tone and make a great first impression. A great answer is concise, relevant, and engaging. Use the **Past, Present, Future** framework.

### 1. Present: Where you are right now.
Start with a brief summary of your current role, highlighting your key responsibilities and a major accomplishment.

*Example: "Currently, I'm a Senior Software Engineer at TechCorp, where I lead the development of our flagship data analytics platform. In the past year, I've been focused on re-architecting our data pipeline, which resulted in a 40% improvement in processing speed."*

### 2. Past: How you got here.
Briefly touch upon your past experience that is relevant to the job you're interviewing for. Connect the dots for the interviewer.

*Example: "Before TechCorp, I worked at Innovate Solutions, where I was responsible for building out their customer-facing API. That's where I really honed my skills in building scalable, resilient backend systems and working directly with product managers to translate user needs into technical specifications."*

### 3. Future: Where you want to go.
Conclude by explaining why you are excited about this specific opportunity and how it aligns with your career goals. This shows you've done your research and are genuinely interested.

*Example: "I'm really excited by this opportunity at your company because I'm passionate about tackling large-scale data challenges, and your team is at the forefront of that field. I'm looking to apply my experience in a role where I can contribute to a high-impact product and continue to grow as an engineering leader."*

**Key Tips:**
- **Keep it concise:** Aim for 1-2 minutes.
- **Be relevant:** Tailor your story to the job description.
- **Be enthusiastic:** Show your passion for your work.
`
  },
  {
    slug: 'cap-theorem',
    title: 'Understanding the CAP Theorem',
    description: 'A simple explanation of Consistency, Availability, and Partition Tolerance in distributed systems.',
    category: 'System Design',
    content: `
## Understanding the CAP Theorem

The CAP theorem is a fundamental principle for distributed systems. It states that it is impossible for a distributed data store to simultaneously provide more than two out of the following three guarantees: Consistency, Availability, and Partition Tolerance.

### C - Consistency
**Every read receives the most recent write or an error.** This means that all nodes in the system see the same data at the same time. After a successful write operation, any subsequent read request will return the updated value.

### A - Availability
**Every request receives a (non-error) response, without the guarantee that it contains the most recent write.** This means the system remains operational and responsive, even if some nodes are down. It will return the best possible version of the data it has access to.

### P - Partition Tolerance
**The system continues to operate despite an arbitrary number of messages being dropped (or delayed) by the network between nodes.** A network partition means there's a communication break between two groups of nodes in the system. Partition tolerance means the system must be able to function even when this happens.

### The Trade-off
In a distributed system, network partitions are a fact of life. You cannot avoid them. Therefore, the CAP theorem forces a trade-off between **Consistency** and **Availability** when a partition occurs.

*   **CP (Consistency + Partition Tolerance):** If a partition happens, the system will choose to return an error or time out if it cannot guarantee that the most recent data is available. This sacrifices availability for consistency. Many relational databases like PostgreSQL in a replicated setup aim for this.

*   **AP (Availability + Partition Tolerance):** If a partition happens, the system will continue to operate and return the best available version of the data, which might not be the most up-to-date. This sacrifices consistency for availability. Many NoSQL databases like Cassandra and DynamoDB are designed with this principle in mind, often favoring "eventual consistency."

When designing a system, you must decide which guarantee is more critical for your use case during a network failure.
`
  },
    {
    slug: 'sql-vs-nosql',
    title: 'SQL vs. NoSQL Databases',
    description: 'Comparing relational and non-relational databases to help you choose the right one.',
    category: 'Technical',
    content: `
## SQL vs. NoSQL Databases

Choosing the right database is a critical architectural decision. The two main categories are SQL (relational) and NoSQL (non-relational).

### SQL (Relational Databases)
SQL databases are also known as relational databases. They use a structured data model, organizing data into tables with rows and columns. They enforce a predefined schema.

*   **Examples:** MySQL, PostgreSQL, Microsoft SQL Server, Oracle.
*   **Schema:** Strict, predefined schema. Data must conform to the table structure.
*   **Scaling:** Typically scale vertically (by increasing the power of a single server, e.g., more CPU, RAM).
*   **ACID Properties:** Guarantee Atomicity, Consistency, Isolation, and Durability, making them excellent for transactional applications.

**When to use SQL:**
- Your data is structured and doesn't change often.
- You need to ensure data integrity and transactional consistency (e.g., financial systems, e-commerce orders).
- You require complex queries and joins across multiple tables.

### NoSQL (Non-Relational Databases)
NoSQL databases provide a mechanism for storage and retrieval of data that is modeled in means other than the tabular relations used in relational databases.

*   **Examples:**
    *   **Document Stores:** MongoDB, CouchDB (JSON-like documents)
    *   **Key-Value Stores:** Redis, DynamoDB (simple key-value pairs)
    *   **Column-Family Stores:** Cassandra, HBase (columns are grouped into families)
    *   **Graph Databases:** Neo4j, Amazon Neptune (nodes and edges)
*   **Schema:** Dynamic schema or schema-less. You can store different data structures in the same collection.
*   **Scaling:** Typically scale horizontally (by adding more servers to the cluster).
*   **BASE Properties:** Generally favor Availability, Soft state, and Eventual consistency over strict ACID compliance.

**When to use NoSQL:**
- You are dealing with large volumes of unstructured or semi-structured data.
- You need high write throughput and horizontal scalability (e.g., social media feeds, IoT data, real-time analytics).
- Your application requires high availability and can tolerate eventual consistency.
- Your data model is evolving rapidly during development.
`
  }
];
