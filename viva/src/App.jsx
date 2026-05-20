import React, { useState, useEffect, useMemo } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'framer-motion';
import { 
  GraduationCap, 
  Code, 
  Network, 
  Brain, 
  ClipboardList, 
  CheckCircle2, 
  FolderOpen, 
  FileCode2, 
  ChevronRight, 
  ChevronDown,
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Award, 
  Sparkles, 
  BookOpen, 
  Terminal, 
  Globe, 
  RefreshCw, 
  HelpCircle,
  Folder,
  Check,
  RotateCcw
} from 'lucide-react';

// ----------------------------------------------------
// DATA: 100 Advanced Viva Questions
// ----------------------------------------------------
const VIVA_QUESTIONS = [
  // --- HTTP & APIs (15 Questions) ---
  { id: 'http1', category: 'HTTP & APIs', question: "What is HTTP and how does it function?", answer: "Hypertext Transfer Protocol is a stateless application layer protocol used to transmit files and data over TCP. It operates on a request-response model: client opens TCP stream, submits request headers/payload, server processes, returns response, and terminates stream." },
  { id: 'http2', category: 'HTTP & APIs', question: "What does 'Stateless Protocol' mean in HTTP?", answer: "It means the server does not store user session data between requests. Every single incoming HTTP request is processed independently and must carry all the identity/data details needed to authorize it." },
  { id: 'http3', category: 'HTTP & APIs', question: "Explain the differences between GET, POST, PUT, PATCH, and DELETE methods.", answer: "1. GET: Fetches resource data (read-only).\n2. POST: Sends payloads to create a new resource.\n3. PUT: Replaces/rewrites entire target resource with payload.\n4. PATCH: Partially updates target resource (only modifies passed fields).\n5. DELETE: Deletes target resource." },
  { id: 'http4', category: 'HTTP & APIs', question: "Describe HTTP status code classes: 1xx, 2xx, 3xx, 4xx, 5xx.", answer: "1. 1xx: Informational alerts.\n2. 2xx: Success (200 OK, 201 Created).\n3. 3xx: Redirections.\n4. 4xx: Client Side Errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found).\n5. 5xx: Server Side Errors (500 Internal Server Error)." },
  { id: 'http5', category: 'HTTP & APIs', question: "What is CORS and why does the browser enforce it?", answer: "Cross-Origin Resource Sharing is a browser security mechanism. It blocks client-side scripts from reading responses of API calls made to a different origin (port/domain) unless the target server explicitly returns headers (e.g. Access-Control-Allow-Origin) permitting it." },
  { id: 'http6', category: 'HTTP & APIs', question: "What is REST and what are its key constraints?", answer: "REpresentational State Transfer is an architectural API style. Constraints include:\n1. Client-Server separation.\n2. Stateless routing.\n3. Cacheable responses.\n4. Uniform interface (resource URIs, HTTP verbs).\n5. Layered system." },
  { id: 'http7', category: 'HTTP & APIs', question: "What are HTTP Request and Response Headers?", answer: "Key-value metadata payloads sent alongside requests/responses to describe data formats, auth tokens, cache rules, cookies, and CORS limits." },
  { id: 'http8', category: 'HTTP & APIs', question: "What is the difference between HTTP and HTTPS?", answer: "HTTPS is HTTP wrapped in an SSL/TLS layer. It encrypts all network packets transmitted between client and server, preventing eavesdropping and tampering by middle-men." },
  { id: 'http9', category: 'HTTP & APIs', question: "What is Payload/Request Body and when is it sent?", answer: "The data block sent to the server following HTTP headers. Used during POST, PUT, or PATCH calls to transmit user inputs, files, or JSON records." },
  { id: 'http10', category: 'HTTP & APIs', question: "What is TCP/IP and how does it relate to HTTP?", answer: "TCP/IP is the transport and network layer suite. TCP provides reliable, ordered transmission of bytes between endpoints. HTTP sits on top of TCP, formatting data requests and responses." },
  { id: 'http11', category: 'HTTP & APIs', question: "Explain the OSI Model layers.", answer: "A 7-layer framework: Physical, Data Link, Network, Transport, Session, Presentation, Application. HTTP/WebSockets operate at Layer 7 (Application); TCP operates at Layer 4 (Transport)." },
  { id: 'http12', category: 'HTTP & APIs', question: "What is DNS (Domain Name System)?", answer: "The phonebook of the web. It translates human-readable domain names (like google.com) into numerical IP addresses (like 142.250.190.46) so browsers can route network packets." },
  { id: 'http13', category: 'HTTP & APIs', question: "What is the purpose of HTTP/2 and HTTP/3?", answer: "To improve web performance. HTTP/2 introduces multiplexing (multiple requests over one connection) and header compression. HTTP/3 swaps TCP for QUIC (UDP-based), resolving head-of-line blocking." },
  { id: 'http14', category: 'HTTP & APIs', question: "What are Query Parameters vs Path Parameters in URL?", answer: "1. Path Parameter: Identifies a resource path: `/api/users/:id`.\n2. Query Parameter: Filters/sorts resources: `/api/users?role=student`." },
  { id: 'http15', category: 'HTTP & APIs', question: "What is WebSockets frame overhead vs HTTP header overhead?", answer: "HTTP requests carry large headers (typically 500-1000 bytes) containing cookies, agent info, etc., on *every* transfer. WebSockets, once established, send lightweight binary frames (overhead is only 2-10 bytes), making WebSockets dramatically more efficient for continuous streaming." },

  // --- REACT (15 Questions) ---
  { id: 're1', category: 'React', question: "What is React and what is the Virtual DOM?", answer: "React is a component-based UI library. The Virtual DOM is a lightweight JS memory representation of the actual DOM. When component state changes, React updates this virtual tree first, diffs it against a previous snapshot, and updates only the changed parts of the real DOM (Reconciliation)." },
  { id: 're2', category: 'React', question: "What is JSX?", answer: "JavaScript XML. A syntax extension allowing HTML structures to be written inside JavaScript. Babel compiles JSX down to standard React nested function calls: `React.createElement(...)`." },
  { id: 're3', category: 'React', question: "What is React State vs Props?", answer: "1. State: Private, local data managed *inside* a component. When state changes, the component re-renders.\n2. Props: Read-only configuration values passed down from parent components." },
  { id: 're4', category: 'React', question: "Explain the `useEffect` Hook and its dependency array.", answer: "Used to handle side-effects in functional components. Dependency array values determine execution: \n1. Omitted: Runs on every render.\n2. Empty Array `[]`: Runs once on mount.\n3. Array `[dep]`: Runs on mount and whenever `dep` changes." },
  { id: 're5', category: 'React', question: "What is React Context API and when should you use it?", answer: "A system to share global data (like auth state or theme) across components without manually passing props down through every level (prop drilling)." },
  { id: 're6', category: 'React', question: "Explain the `useMemo` hook vs the `useCallback` hook.", answer: "1. `useMemo`: Caches and returns the memoized *value* of a heavy function computation.\n2. `useCallback`: Caches and returns the memoized *function instance* itself to prevent re-creation on renders." },
  { id: 're7', category: 'React', question: "What are React Keys and why are they needed in lists?", answer: "Keys are unique string tags passed to elements in array loops. They help React identify which items were modified, added, or removed during virtual DOM diffing, optimizing rendering performance." },
  { id: 're8', category: 'React', question: "What is a custom hook in React?", answer: "A reusable JavaScript function prefix-named with 'use' (e.g. `useSocket`) that can call other React hooks to extract component logic into reusable modules." },
  { id: 're9', category: 'React', question: "What is the difference between Controlled and Uncontrolled components?", answer: "1. Controlled: Element values (like input text) are bound to React state and updated via `onChange` handlers.\n2. Uncontrolled: Element data is pulled directly from the DOM using React `useRef` refs." },
  { id: 're10', category: 'React', question: "Explain Code Splitting and Lazy Loading in React.", answer: "Webpack splits the code bundle into smaller chunks. Using `React.lazy()` and `<Suspense>`, we load pages only when the user navigates to them, improving initial page load speed." },
  { id: 're11', category: 'React', question: "What is the difference between client-side state hooks (useState) and global context (Context API)?", answer: "`useState` stores state isolated to a single component and its direct children. `Context API` acts as a global broadcast channel, bypassing middle components entirely to distribute state directly to any subscribing child." },
  { id: 're12', category: 'React', question: "What is double rendering in React StrictMode and why does it happen?", answer: "In development mode, React StrictMode intentionally renders components twice. This helps identify side-effects, memory leaks, and impure state updates that could cause bugs in production." },
  { id: 're13', category: 'React', question: "How does React Router DOM handle page navigation?", answer: "It intercepts browser URL changes, matches the path to a declared `<Route>` component, and dynamically swaps the page view without triggering a full page reload." },
  { id: 're14', category: 'React', question: "What does the `useRef` hook do?", answer: "Provides a mutable reference object whose `.current` property persists across renders. Changing its value does *not* trigger a component re-render. Often used to access DOM elements directly." },
  { id: 're15', category: 'React', question: "What is prop drilling and how do you resolve it?", answer: "The process of passing props through multiple levels of nested child components that don't need the data themselves, just to reach a deep child. Solved using Context API or Redux." },

  // --- EXPRESS & NODE (15 Questions) ---
  { id: 'ex1', category: 'Express & Node', question: "What is Node.js and how does it handle asynchronous I/O?", answer: "Node.js is a V8-based JavaScript runtime. It is single-threaded and uses an Event Loop. For heavy operations (like reading files or network requests), it delegates work to the OS kernel or thread pool (libuv) and resumes execution when notified, avoiding thread blocking." },
  { id: 'ex2', category: 'Express & Node', question: "What is Express.js?", answer: "A minimal and flexible web application framework for Node.js. It simplifies routing, middleware integration, and API creation." },
  { id: 'ex3', category: 'Express & Node', question: "What is Express Middleware and what are its parameters?", answer: "Middleware is a function executing between request receipt and response delivery. Parameters: `req` (request object), `res` (response object), and `next` (callback triggering the next handler)." },
  { id: 'ex4', category: 'Express & Node', question: "Explain the difference between `app.use()` and specific route verbs like `app.post()`.", answer: "`app.use()` applies middleware globally to all HTTP methods and paths starting with a prefix. Specific verbs like `app.post()` or `app.get()` only handle matches for that specific method and exact URL." },
  { id: 'ex5', category: 'Express & Node', question: "What is the role of `body-parser` or `express.json()` middleware?", answer: "Express by default cannot parse request body text. `express.json()` intercepts incoming POST/PUT JSON strings and parses them into a readable JavaScript object at `req.body`." },
  { id: 'ex6', category: 'Express & Node', question: "Explain `process.env` and the `dotenv` library.", answer: "`process.env` holds environment variables. The `dotenv` library loads configuration tokens (like DB URLs, secrets) from a local `.env` file into memory at server startup, avoiding hardcoded secrets." },
  { id: 'ex7', category: 'Express & Node', question: "What is CORS middleware in Express?", answer: "An Express package configured to append Access-Control-Allow-Origin headers to API responses, allowing or blocking requests from origins like a React client." },
  { id: 'ex8', category: 'Express & Node', question: "How do you handle errors globally in Express?", answer: "By registering an error-handling middleware *after* all routes. It must take four parameters: `(err, req, res, next)`. Any route throwing an error will automatically fall into this handler." },
  { id: 'ex9', category: 'Express & Node', question: "What is the event loop phase distribution in Node.js?", answer: "The event loop operates in specific phases:\n1. Timers (setTimeout/setInterval)\n2. Pending callbacks (system I/O)\n3. Idle/prepare (internal)\n4. Poll (retrieves new I/O events)\n5. Check (setImmediate callbacks)\n6. Close callbacks (socket disconnect cleanups)." },
  { id: 'ex10', category: 'Express & Node', question: "What is NPM?", answer: "Node Package Manager. A tool and registry to manage project packages, dependencies, and script shortcuts (declared in package.json)." },
  { id: 'ex11', category: 'Express & Node', question: "What is the difference between CommonJS and ES Modules?", answer: "1. CommonJS: Traditional Node module format (`require()` and `module.exports`), evaluated synchronously.\n2. ES Modules: Modern standard (`import` and `export`), statically parsed before execution." },
  { id: 'ex12', category: 'Express & Node', question: "What are streams and buffer buffers in Node?", answer: "1. Buffer: Chunks of memory holding raw binary bytes.\n2. Stream: An interface to read or write data incrementally in chunks, avoiding loading huge files into RAM at once." },
  { id: 'ex13', category: 'Express & Node', question: "Explain how Express handles asynchronous route errors in Node v14+ vs older versions.", answer: "In older Express v4, asynchronous errors (e.g. unhandled Promise rejections inside async route handlers) had to be caught manually and passed using `next(error)`. In Node v16+ and Express v5, async errors are intercepted automatically and forwarded to the global error middleware." },
  { id: 'ex14', category: 'Express & Node', question: "Explain Node's single-threaded nature. Can it run multi-threaded?", answer: "JS code runs on a single main thread. However, under the hood, Node utilizes the libuv thread pool for heavy system I/O tasks. You can also run multi-threaded JS using worker_threads." },
  { id: 'ex15', category: 'Express & Node', question: "What is the difference between `res.send()` and `res.json()` in Express?", answer: "`res.json()` automatically sets the Content-Type header to `application/json` and stringifies JS objects. `res.send()` is generic and can return strings, HTML, or buffers." },

  // --- DATABASE (MONGOOSE & MONGO) (15 Questions) ---
  { id: 'db1', category: 'MongoDB & Mongoose', question: "What is MongoDB and how is data structured?", answer: "MongoDB is a NoSQL document database. Data is stored in collections as BSON (Binary JSON) documents. Each document is a key-value structure containing flexible dynamic types, avoiding strict SQL table layouts." },
  { id: 'db2', category: 'MongoDB & Mongoose', question: "Why use NoSQL MongoDB instead of relational SQL databases?", answer: "MongoDB excels at scaling and flexible schemas. In academic apps, user structures differ by role: students need grades/semesters; teachers need departments. Storing this dynamically in document models is simpler than maintaining multi-table relational SQL Joins." },
  { id: 'db3', category: 'MongoDB & Mongoose', question: "What is Mongoose and why do we use it with MongoDB?", answer: "Mongoose is an Object Data Modeling (ODM) library for Node. It enforces structure and schema rules on MongoDB, handles validators (e.g. verifying email formats), manages database models, and handles query operations." },
  { id: 'db4', category: 'MongoDB & Mongoose', question: "What is a Schema vs a Model in Mongoose?", answer: "1. Schema: The architectural blueprint defining data structure, fields, and types.\n2. Model: A compiled constructor class built from the schema. It interacts directly with the database to find, create, or update records." },
  { id: 'db5', category: 'MongoDB & Mongoose', question: "Explain Mongoose validations and give examples.", answer: "Schema-level rules to ensure data integrity. Examples: `required: true`, custom regex arrays for password complexity, or setting `min` and `max` values on student marks." },
  { id: 'db6', category: 'MongoDB & Mongoose', question: "How does `populate()` work in Mongoose and why is it useful?", answer: "Mongoose doesn't support SQL Joins. We store document references (`ObjectId`). `populate()` queries and replaces these IDs with the actual referenced documents (e.g. replacing a `requester` ID with the full `User` details)." },
  { id: 'db7', category: 'MongoDB & Mongoose', question: "Explain Mongoose Hooks (Middleware) like `pre` and `post`.", answer: "Functions that run before or after database events. In EduSync, a `pre('save')` hook hashes the user's password using bcrypt before it is saved to MongoDB." },
  { id: 'db8', category: 'MongoDB & Mongoose', question: "What is the difference between SQL and NoSQL?", answer: "1. SQL: Relational tables, strict schemas, ACID transactions, uses JOIN statements.\n2. NoSQL: Document-oriented, flexible dynamic structures, high scalability, denormalized references." },
  { id: 'db9', category: 'MongoDB & Mongoose', question: "What is an index scan vs a collection scan in MongoDB?", answer: "A collection scan (COLLSCAN) requires MongoDB to read *every single* document in a collection to return results, which is very slow. An index scan (IXSCAN) uses pre-sorted index pointer keys (like indexed `userId`), returning matching records almost instantly." },
  { id: 'db10', category: 'MongoDB & Mongoose', question: "Explain what ObjectId is in MongoDB.", answer: "A unique 12-byte identifier automatically generated for every MongoDB document. It consists of a timestamp, machine identifier, process ID, and an incrementing counter." },
  { id: 'db11', category: 'MongoDB & Mongoose', question: "What does `{ timestamps: true }` do in Mongoose?", answer: "Instructs Mongoose to automatically append and maintain `createdAt` and `updatedAt` date fields on every document." },
  { id: 'db12', category: 'MongoDB & Mongoose', question: "What is the difference between `find()`, `findOne()`, and `findById()`?", answer: "1. `find()`: Returns an array of all matching documents.\n2. `findOne()`: Returns the first matching document.\n3. `findById()`: Directly returns the document matching the target `_id`." },
  { id: 'db13', category: 'MongoDB & Mongoose', question: "How does Mongoose handle transactions?", answer: "Using MongoDB Sessions, transactions let you run multiple database writes. If one fails, the entire transaction is rolled back, maintaining database integrity." },
  { id: 'db14', category: 'MongoDB & Mongoose', question: "What are Mongoose Virtuals and when do we use them?", answer: "Properties that can be set on documents but are *not* saved to MongoDB (e.g. combining `firstName` and `lastName` to return `fullName` on query). Often configured with `{ toJSON: { virtuals: true } }` so they serialize and send correctly to the React client." },
  { id: 'db15', category: 'MongoDB & Mongoose', question: "Explain normalization vs denormalization in MongoDB.", answer: "1. Normalization: Referencing documents by storing ObjectIds. Keeps data clean and dry.\n2. Denormalization: Duplicating fields across documents (e.g. writing student batch directly in attendance logs). Speeds up queries by removing `$lookup/populate` workloads." },

  // --- SECURITY & JWT (15 Questions) ---
  { id: 'sec1', category: 'Security & JWT', question: "What is JWT (JSON Web Token) and what is its structure?", answer: "A stateless session token split into three parts:\n1. Header: Signing algorithm info.\n2. Payload: User identity claims (role, id).\n3. Signature: Cryptographic hash of header + payload + secret key. Authenticates the token." },
  { id: 'sec2', category: 'Security & JWT', question: "Why do we use Access and Refresh tokens?", answer: "Access tokens are short-lived (15 mins) and sent in headers. If stolen, they expire quickly. Refresh tokens are long-lived (7 days) and stored in secure cookies, generating new access tokens without requiring login prompts." },
  { id: 'sec3', category: 'Security & JWT', question: "Why do we hash passwords instead of encrypting them?", answer: "Hashing is a one-way mathematical function. Since hashes cannot be reversed, a database leak will not expose plaintext credentials. Encryption is reversible and key-theft exposes all credentials." },
  { id: 'sec4', category: 'Security & JWT', question: "What is bcrypt and what are 'salts'?", answer: "bcrypt is a hashing function. A 'salt' is a random string added to the password before hashing, ensuring identical passwords produce unique hash results to block rainbow dictionary attacks." },
  { id: 'sec5', category: 'Security & JWT', question: "What is an HttpOnly Cookie and why is it secure?", answer: "A browser cookie flag that prevents client-side JavaScript (like `document.cookie`) from reading the token. This blocks token extraction via XSS (Cross-Site Scripting)." },
  { id: 'sec6', category: 'Security & JWT', question: "What is XSS (Cross-Site Scripting) and how do we prevent it?", answer: "An attack where malicious scripts are injected into web pages. Prevented by escaping user input, sanitizing data, and storing session tokens in HttpOnly cookies." },
  { id: 'sec7', category: 'Security & JWT', question: "What is CSRF (Cross-Site Request Forgery) and how do we prevent it?", answer: "An attack forcing a user's browser to execute unwanted actions on a trusted site. Prevented using anti-CSRF tokens, checking Referer headers, or setting cookie `SameSite` flags to `Strict`." },
  { id: 'sec8', category: 'Security & JWT', question: "How does bcrypt protect against GPU brute-forcing (Key Stretching/Work Factor)?", answer: "bcrypt runs a key derivation algorithm configured with a 'work factor' (rounds). This introduces artificial mathematical delay (e.g. 50-100ms per attempt). While unnoticeable to a single user, it blocks high-speed GPU dictionary cracking systems." },
  { id: 'sec9', category: 'Security & JWT', question: "What is a Replay Attack in JWT and how does token expiration mitigate it?", answer: "An attack where an eavesdropper intercepts a valid JWT and reuses it to gain access. Setting a short expiration time (e.g., 15 minutes) limits the active window during which an intercepted token remains valid." },
  { id: 'sec10', category: 'Security & JWT', question: "What is the payload of a JWT? Can sensitive data be placed there?", answer: "The payload holds custom user attributes (like `userId` and `role`). You must never store sensitive data like passwords there, as the payload is simply Base64 encoded and readable by anyone." },
  { id: 'sec11', category: 'Security & JWT', question: "How does the backend verify a JWT?", answer: "The verify token middleware extracts the token from headers, hashes the header and payload with its secret key, and compares it to the token signature. If they match, the identity is verified." },
  { id: 'sec12', category: 'Security & JWT', question: "What is Rate Limiting and why is it used?", answer: "Restricting API requests from a single IP to protect the server from DDoS attacks and brute-force login attempts." },
  { id: 'sec13', category: 'Security & JWT', question: "What is OAuth?", answer: "An open authorization protocol allowing users to share private resources with third-party applications without exposing their passwords (e.g. 'Log in with Google')." },
  { id: 'sec14', category: 'Security & JWT', question: "Explain the SameSite cookie attribute.", answer: "Controls cookie delivery in cross-site requests. Options: `Strict` (never sent on cross-site requests), `Lax` (sent on top-level navigations), or `None` (sent on all requests)." },
  { id: 'sec15', category: 'Security & JWT', question: "What is a brute-force attack?", answer: "An attack trying every possible password combination until it finds the correct one. Blocked using rate-limiting, captcha challenge checks, and account lockout rules." },

  // --- SOCKET.IO (15 Questions) ---
  { id: 'sock1', category: 'Socket.IO', question: "What is WebSocket protocol?", answer: "A TCP-based network protocol (ws://) providing full-duplex, persistent communication channels between client and server over a single connection." },
  { id: 'sock2', category: 'Socket.IO', question: "What is the difference between HTTP polling and WebSockets?", answer: "HTTP polling repeatedly calls APIs to check for updates, wasting bandwidth. WebSockets establish a single persistent connection, allowing the server to push updates instantly." },
  { id: 'sock3', category: 'Socket.IO', question: "Why use Socket.IO over raw WebSockets?", answer: "Socket.IO simplifies connection management, automatically reconnects if dropped, supports rooms, and falls back to HTTP polling if WebSockets are blocked by firewalls." },
  { id: 'sock4', category: 'Socket.IO', question: "How does Socket.IO authenticate connections?", answer: "By verifying the client's JWT token during the initial connection handshake. Unauthenticated connections are rejected before joining any rooms." },
  { id: 'sock5', category: 'Socket.IO', question: "What are Rooms in Socket.IO?", answer: "Isolated socket channels on the server. Sockets can join rooms (e.g. `socket.join('admins')`), enabling targeted broadcasts to specific groups." },
  { id: 'sock6', category: 'Socket.IO', question: "What is a broadcast event in Socket.IO?", answer: "An event emitted to all connected sockets except the sender, or to everyone in a specific room." },
  { id: 'sock7', category: 'Socket.IO', question: "Explain namespaces in Socket.IO.", answer: "Dedicated communication pathways multiplexed over a single connection, separating socket traffic (e.g. `/chat` vs `/notifications`)." },
  { id: 'sock8', category: 'Socket.IO', question: "What is the difference between `socket.emit()` and `io.emit()`?", answer: "1. `socket.emit()`: Sends an event to only the sender client.\n2. `io.emit()`: Broadcasts the event globally to all connected clients." },
  { id: 'sock9', category: 'Socket.IO', question: "What is the handshake in Socket.IO?", answer: "The initial HTTP request sent by the client to upgrade the connection to WebSocket. This is where connection tokens are validated." },
  { id: 'sock10', category: 'Socket.IO', question: "How does Socket.IO handle disconnection?", answer: "It emits a 'disconnect' event. The server detects the drop, logs it, cleans up reference stores, and automatically tries to reconnect." },
  { id: 'sock11', category: 'Socket.IO', question: "How does Socket.IO manage heartbeats and ping/pong packets?", answer: "To verify connection status, the Socket.IO server continuously sends ping packets. The client replies with a pong. If the server does not receive a pong within the configured timeout threshold, it considers the connection dead and cleans up." },
  { id: 'sock12', category: 'Socket.IO', question: "How do we prevent memory leaks when registering event listeners in `SocketContext.jsx`?", answer: "In React's useEffect, when registering `socket.on('event', callback)`, you must return a cleanup function containing `socket.off('event', callback)` to clean up listeners when components unmount." },
  { id: 'sock13', category: 'Socket.IO', question: "What is multiplexing in Socket.IO?", answer: "The capacity to run separate namespaces (like `/chat` and `/admin`) over a single underlying TCP connection, isolating traffic without opening multiple network sockets." },
  { id: 'sock14', category: 'Socket.IO', question: "What is the socket ID and can we rely on it for user tracking?", answer: "The unique identifier generated for every connection. It changes on every page refresh or reconnect, meaning you cannot rely on it for long-term user tracking (use database User IDs instead)." },
  { id: 'sock15', category: 'Socket.IO', question: "What is the maximum room size limit in Socket.IO?", answer: "There is no theoretical limit to room memberships. However, broadcasting to rooms containing thousands of concurrent connections will increase server CPU and memory usage, requiring load balancing." },

  // --- PROJECT WORKFLOWS (10 Questions) ---
  { id: 'proj1', category: 'Project Architecture', question: "What is the project file architecture of EduSync?", answer: "Divided into: \n1. `/client`: React, Vite, Tailwind CSS, Axios, and contexts.\n2. `/server`: Node, Express, MongoDB schemas, and socket handlers." },
  { id: 'proj2', category: 'Project Architecture', question: "Walk through the login flow.", answer: "User logs in -> Axios POST to `/api/auth/login` -> Express verifies credentials -> Server issues access token in response body and refresh token in HttpOnly cookie -> React stores user/token in `AuthContext`." },
  { id: 'proj3', category: 'Project Architecture', question: "How does the token refresh interceptor work?", answer: "API returns `401 Unauthorized` -> Axios interceptor pauses, POSTs to `/auth/refresh` -> Server sends new access token -> Interceptor retries original failed request." },
  { id: 'proj4', category: 'Project Architecture', question: "How does a teacher request get approved?", answer: "Teacher submits request via API -> Server saves pending state and emits `new_request` to admins room -> Admin approves request via API -> Server runs payload logic (attendance update/circular) and notifies target rooms." },
  { id: 'proj5', category: 'Project Architecture', question: "Where is the Express app linked to the HTTP server?", answer: "In `server/index.js`, the Express instance is passed to `http.createServer(app)`. Socket.IO is attached to this HTTP server, allowing WebSockets and Express routes to share the same port." },
  { id: 'proj6', category: 'Project Architecture', question: "How is CORS configured in our Express backend?", answer: "Using the `cors` package. We set the origin parameter to the client URL (`http://localhost:5173`) and set `credentials: true` to allow cookie transfers." },
  { id: 'proj7', category: 'Project Architecture', question: "Explain the role-based middleware logic on the backend.", answer: "The `authorize(...roles)` middleware checks the role of the user (attached to `req.user` by the `verifyToken` middleware) and returns 403 if it does not match." },
  { id: 'proj8', category: 'Project Architecture', question: "How does the Nodemailer OTP password recovery flow work?", answer: "forgotPassword route generates a random 6-digit OTP -> stores it in-memory with TTL -> sends to user via Nodemailer SMTP. resetPassword route verifies code and updates hashed database entries." },
  { id: 'proj9', category: 'Project Architecture', question: "How does React Context help Socket connection routing?", answer: "The `SocketProvider` wraps the app. It initializes a socket connection only when the user is logged in, and distributes this single socket instance to all child components via context." },
  { id: 'proj10', category: 'Project Architecture', question: "Why do we perform role checks on both frontend and backend?", answer: "Frontend checks control UI layouts (UX). Backend middleware guards actual API endpoints, securing data from manual API requests." }
];

// ----------------------------------------------------
// DATA: Project Directory Tree
// ----------------------------------------------------
const PROJECT_TREE = {
  name: "EduSync",
  isDir: true,
  desc: "Root project folder containing the decoupled client frontend and server backend codebases.",
  children: [
    {
      name: "client",
      isDir: true,
      desc: "React frontend application compiled with Vite and styled using Tailwind CSS.",
      children: [
        {
          name: "src",
          isDir: true,
          desc: "React frontend source files directory.",
          children: [
            {
              name: "api",
              isDir: true,
              desc: "Axios HTTP client configuration.",
              children: [
                { name: "axios.js", isDir: false, desc: "Configures the Axios client instance and implements the automatic JWT access token refresh mechanism using a response interceptor.", stackRole: "Frontend (Axios Interceptor)" }
              ]
            },
            {
              name: "context",
              isDir: true,
              desc: "React Context Providers managing global application state.",
              children: [
                { name: "AuthContext.jsx", isDir: false, desc: "Manages user login/logout session states, handles access tokens, and controls client-side route authorization.", stackRole: "Frontend State Context" },
                { name: "SocketContext.jsx", isDir: false, desc: "Establishes connection to the Socket.IO server using the auth token and listens for real-time notifications.", stackRole: "Frontend Socket Provider" }
              ]
            },
            {
              name: "pages",
              isDir: true,
              desc: "React page components defining individual URL layout views.",
              children: [
                { name: "Login.jsx", isDir: false, desc: "Login UI capturing user credentials and credentials payload to submit to authentication APIs.", stackRole: "Frontend View" },
                { name: "ForgotPassword.jsx", isDir: false, desc: "Implements the email password recovery UI, capturing emails and OTP inputs.", stackRole: "Frontend View" },
                { name: "Dashboard.jsx", isDir: false, desc: "Student dashboard rendering Recharts analytical data widgets.", stackRole: "Frontend View" }
              ]
            },
            { name: "App.jsx", isDir: false, desc: "Root component defining global client routes, layouts, and Context Provider wrappers.", stackRole: "Frontend Root Router" }
          ]
        },
        { name: "package.json", isDir: false, desc: "Declares frontend package dependencies (React, Recharts, Socket.io-client) and dev commands.", stackRole: "Config Manifest" }
      ]
    },
    {
      name: "server",
      isDir: true,
      desc: "Node.js and Express backend server handling routes, database CRUD, and socket triggers.",
      children: [
        {
          name: "controllers",
          isDir: true,
          desc: "Route handler functions containing business logic and database operations.",
          children: [
            { name: "authController.js", isDir: false, desc: "Implements authentication endpoints: verifying logins, generating JWTs, and running OTP password reset flows.", stackRole: "Backend Controller" },
            { name: "requestController.js", isDir: false, desc: "Manages approval logs. Writes records to MongoDB and pushes real-time socket events.", stackRole: "Backend Controller" }
          ]
        },
        {
          name: "middleware",
          isDir: true,
          desc: "Custom Express middleware filters running before route handlers.",
          children: [
            { name: "authMiddleware.js", isDir: false, desc: "Includes verifyToken (verifies Bearer header JWT) and authorize (guards routes based on roles).", stackRole: "Backend Middleware" }
          ]
        },
        {
          name: "models",
          isDir: true,
          desc: "Mongoose schema classes defining data structures in MongoDB.",
          children: [
            { name: "User.js", isDir: false, desc: "User database schema. Contains a pre-save hook to hash password fields using bcrypt.", stackRole: "Backend Model" },
            { name: "Request.js", isDir: false, desc: "Stores teacher requests, payload details, target references, and status flags.", stackRole: "Backend Model" }
          ]
        },
        {
          name: "socket",
          isDir: true,
          desc: "Socket.IO event managers.",
          children: [
            { name: "socketHandler.js", isDir: false, desc: "Listens for socket connections, verifies handshake tokens, and maps connections into rooms.", stackRole: "Backend Socket Handler" }
          ]
        },
        { name: "index.js", isDir: false, desc: "Backend entry point. Connects to MongoDB, starts the HTTP server, and initializes Express and Socket.IO.", stackRole: "Backend Entry Point" }
      ]
    }
  ]
};

// ----------------------------------------------------
// DATA: Glossary Terms
// ----------------------------------------------------
const GLOSSARY_TERMS = [
  { name: "JWT", def: "JSON Web Token. Compact, self-contained method for securely transmitting session information between client and server as a JSON object, cryptographically signed." },
  { name: "CORS", def: "Cross-Origin Resource Sharing. Browser-enforced security restricting a web app from reading API responses from a different origin (port/domain) unless the server permits it." },
  { name: "Middleware", def: "Express function block executing between receiving a request and returning a response. Used for auth checks, parsing bodies, and logging errors." },
  { name: "bcryptjs", def: "Library used for password security. Salting and hashing credentials irreversibly before they are written to the database." },
  { name: "WebSockets", def: "Network protocol allowing two-way persistent full-duplex TCP communication channels over a single network stream." },
  { name: "Socket.IO Rooms", def: "Virtual channels inside the Socket.IO server. Sockets join rooms using `.join()`, allowing server messages to be targeted to specific subsets of clients." },
  { name: "Axios Interceptor", def: "A global hook in Axios. Responds to API errors (like 401 Unauthorized) to silently refresh tokens and retry the original request." },
  { name: "HttpOnly Cookie", def: "Cookie parameter blocking client-side JavaScript access. Crucial for storing JWT refresh tokens to defend against XSS theft." },
  { name: "MongoDB", def: "NoSQL document database storing records in dynamic BSON (Binary JSON) documents. Ideal for flexible and polymorphic user schemas." },
  { name: "Mongoose ODM", def: "Object-Document Mapper for MongoDB, introducing validations, data relationship populating, schemas, and event hooks on Node.js." },
  { name: "Nodemailer", def: "Node.js package used to send emails using SMTP servers, implemented in EduSync to dispatch password reset verification OTPs." },
  { name: "Vite Proxy", def: "Local configuration forwarding frontend API calls from the client port (5173) to the backend port (5000) to bypass CORS issues during development." }
];

// ----------------------------------------------------
// DATA: Visual Flows Steps
// ----------------------------------------------------
const AUTH_FLOW_STEPS = [
  { title: "1. Login Credentials", desc: "User submits credentials. The backend checks verification in DB against bcrypt hash. If valid, server signs JWTs.", activeRole: "Client -> Server" },
  { title: "2. Token Allocation", desc: "Server issues access token (placed in JSON response body) and refresh token (placed inside an HttpOnly cookie). User dashboard loads.", activeRole: "Server -> Client" },
  { title: "3. API Execution", desc: "Client sends access token inside Authorization headers (Bearer format) for data requests. Express middleware verifyToken authorizes it.", activeRole: "Client -> API" },
  { title: "4. Token Expiration", desc: "After 15 minutes, access token expires. Client calls an API; Express verifies and returns a 401 Unauthorized payload.", activeRole: "API -> Client (401)" },
  { title: "5. Intercept & Refresh", desc: "Axios response interceptor pauses the error, triggers request to /auth/refresh with HttpOnly cookie automatically. Express signs a fresh access token.", activeRole: "Client -> /auth/refresh" },
  { title: "6. Request Re-attempt", desc: "Axios updates Authorization header, retries original failed API request. Seamless restore occurs with zero page redirects.", activeRole: "Client -> API (Retry)" }
];

const SOCKET_FLOW_STEPS = [
  { title: "1. Client Connection", desc: "Client logs in. SocketProvider context reads token, establishing WebSocket connection and sending token in auth handshake payload.", activeRole: "React Client (io())" },
  { title: "2. Server Handshake", desc: "socketHandler.js intercepts connection, validates token using JWT secrets, queries Mongoose, and links user details to socket connection.", activeRole: "Express Server" },
  { title: "3. Room Mapping", desc: "Connected socket joins user-specific room (user:id) and role channels (admins, teachers, students, batch:CSE-3). Connection logged.", activeRole: "Socket.join()" },
  { title: "4. Request Creation", desc: "Teacher issues a circular request. Request saves in MongoDB. Request controller retrieves socket server instance via app.get('io').", activeRole: "Teacher Client -> API" },
  { title: "5. Admin Notification", desc: "Controller targets the 'admins' room: io.to('admins').emit('new_request', request). Admins see notification pop up instantly.", activeRole: "Socket.io Broadcast" },
  { title: "6. Approval Broadcast", desc: "Admin approves request. Server writes Circular document and broadcasts new_circular event to students or specific batch room. Students receive alarm.", activeRole: "Socket.io Targeted Broadcast" }
];

const RESET_FLOW_STEPS = [
  { title: "1. Forgot Trigger", desc: "User inputs email at /forgot-password. Axios submits request to backend authController.js `/forgot-password` endpoint.", activeRole: "Client -> Server (POST)" },
  { title: "2. OTP Generation", desc: "Server verifies email exists, generates a 6-digit random code, and caches `{ otp, expiresAt }` in an in-memory Map keyed by email.", activeRole: "Express Server Map" },
  { title: "3. Nodemailer Dispatch", desc: "Server uses Nodemailer to send email to the user containing the OTP, setting a 10-minute expiry (TTL) in memory.", activeRole: "Nodemailer SMTP" },
  { title: "4. OTP Input", desc: "User enters email, OTP, and new password. Client posts parameters to `/auth/reset-password` API.", activeRole: "Client -> Server (POST)" },
  { title: "5. Code Validation", desc: "Server retrieves OTP from Map. Checks presence, confirms expiry is in future, and evaluates code equality. Rejects if invalid.", activeRole: "Express Server Validation" },
  { title: "6. Database Crypt Save", desc: "If valid, server fetches User document, assigns new password, and saves it. User pre-save hook runs bcrypt, hashing the password before database write.", activeRole: "Mongoose pre-save -> MongoDB" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('study-guide');
  const [masteredQuestions, setMasteredQuestions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('viva_mastered') || '{}');
    } catch {
      return {};
    }
  });

  // Study Guide Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedStates, setCollapsedStates] = useState({});

  // Tree States
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({ 'EduSync': true });

  // Flow States
  const [selectedFlow, setSelectedFlow] = useState('auth');
  const [flowStepIndex, setFlowStepIndex] = useState(0);

  // Quiz States
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScores, setQuizScores] = useState({});
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Glossary States
  const [glossarySearch, setGlossarySearch] = useState('');

  // Persist Mastery
  const toggleMastery = (qId) => {
    const updated = { ...masteredQuestions, [qId]: !masteredQuestions[qId] };
    setMasteredQuestions(updated);
    localStorage.setItem('viva_mastered', JSON.stringify(updated));
  };

  const masteredCount = useMemo(() => {
    return Object.keys(masteredQuestions).filter(k => masteredQuestions[k]).length;
  }, [masteredQuestions]);

  const progressPercent = useMemo(() => {
    return Math.round((masteredCount / VIVA_QUESTIONS.length) * 100);
  }, [masteredCount]);

  // Collapsed handlers
  const toggleCollapse = (qId) => {
    setCollapsedStates(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const setAllCollapse = (collapsed) => {
    const nextStates = {};
    VIVA_QUESTIONS.forEach(q => {
      nextStates[q.id] = collapsed;
    });
    setCollapsedStates(nextStates);
  };

  // Filtered Study Qs
  const filteredQuestions = useMemo(() => {
    return VIVA_QUESTIONS.filter(q => {
      const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
      const matchSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Quiz calculations
  const quizProgressPercent = useMemo(() => {
    if (!quizQuestions.length) return 0;
    return Math.round((quizIndex / quizQuestions.length) * 100);
  }, [quizIndex, quizQuestions]);

  const quizConfidencePercent = useMemo(() => {
    const scoresArray = Object.values(quizScores);
    if (!scoresArray.length) return 0;
    let points = 0;
    scoresArray.forEach(s => {
      if (s === 'good') points += 100;
      if (s === 'partial') points += 50;
    });
    return Math.round(points / scoresArray.length);
  }, [quizScores]);

  const startQuiz = () => {
    const shuffled = [...VIVA_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizQuestions(shuffled);
    setQuizIndex(0);
    setQuizScores({});
    setQuizRevealed(false);
    setQuizFinished(false);
    setQuizActive(true);
  };

  const handleGrade = (score) => {
    const currentQ = quizQuestions[quizIndex];
    setQuizScores(prev => ({ ...prev, [currentQ.id]: score }));
    
    if (quizIndex < 9) {
      setQuizIndex(prev => prev + 1);
      setQuizRevealed(false);
    } else {
      setQuizFinished(true);
    }
  };

  // Flow timeline selections
  const currentFlowSteps = useMemo(() => {
    if (selectedFlow === 'auth') return AUTH_FLOW_STEPS;
    if (selectedFlow === 'socket') return SOCKET_FLOW_STEPS;
    return RESET_FLOW_STEPS;
  }, [selectedFlow]);

  // Toggle tree folders
  const toggleTreeFolder = (nodeName) => {
    setExpandedNodes(prev => ({ ...prev, [nodeName]: !prev[nodeName] }));
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] bg-grid py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-100">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-white/10 pb-8 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-500/10 text-blue-400 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-blue-500/15 flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                React Engine Active
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-emerald-500/15 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                100 Core Topics
              </span>
              <span className="bg-purple-500/10 text-purple-400 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-purple-500/15">
                Vercel Deploy Ready
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-outfit bg-gradient-to-r from-blue-400 via-indigo-200 to-white bg-clip-text text-transparent">
              EduSync Project Viva Prep Dashboard
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
              Welcome <span className="text-blue-400 font-semibold font-outfit">Paras</span>! Master the complete full-stack MERN workflow, Socket namespaces, stateless authentication, database schemas, and HTTP protocols.
            </p>
          </div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-5 rounded-2xl flex items-center gap-5 border border-white/10 shrink-0 self-start lg:self-center shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3.5 rounded-xl text-white shadow-lg relative z-10 shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold font-mono">Mastery Progress</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-extrabold text-white tracking-tight font-outfit">{masteredCount}</span>
                <span className="text-xs text-slate-400 font-medium">/ {VIVA_QUESTIONS.length} Mastered</span>
              </div>
              <div className="w-40 bg-slate-800 h-2 rounded-full overflow-hidden mt-2 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Tab Controls */}
        <nav className="bg-gray-950/60 p-1.5 rounded-2xl border border-white/5 flex flex-wrap gap-1 max-w-fit shadow-xl backdrop-blur-xl">
          {[
            { id: 'study-guide', label: 'Study Guide', icon: BookOpen },
            { id: 'code-structure', label: 'Code Inspector', icon: Code },
            { id: 'visual-flow', label: 'Architecture Loops', icon: Network },
            { id: 'simulator', label: 'Viva Quiz', icon: Brain },
            { id: 'cheatsheet', label: 'Cheatsheet Glossary', icon: ClipboardList }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'visual-flow') setFlowStepIndex(0);
                }}
                className={`tab-btn flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer active-press ${
                  active 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.35)] border border-blue-500/20' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* TAB CONTENTS */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: STUDY GUIDE */}
          {activeTab === 'study-guide' && (
            <motion.section
              key="study-guide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Quick Comparison Grids */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Hashing vs Encryption", color: "border-blue-500/20 hover:border-blue-500/40", points: [
                    { label: "Hashing (One-Way):", val: "Irreversible output fingerprint. You cannot decrypt it. Used to secure database passwords (e.g. bcrypt)." },
                    { label: "Encryption (Two-Way):", val: "Reversible cipher conversion. Can be deciphered with keys. Used for secure network transport (e.g. HTTPS)." }
                  ]},
                  { title: "Authentication vs Authorization", color: "border-emerald-500/20 hover:border-emerald-500/40", points: [
                    { label: "Authentication (Identity):", val: "\"Are you who you claim to be?\" Checked via login validation and OTP email matches." },
                    { label: "Authorization (Privilege):", val: "\"Are you allowed to run this action?\" Checked via route verification of user roles (Student vs Admin)." }
                  ]},
                  { title: "WebSocket vs Socket.IO", color: "border-amber-500/20 hover:border-amber-500/40", points: [
                    { label: "WebSockets (Protocol):", val: "Standard TCP application layer network protocol supporting persistent two-way bi-directional messaging streams." },
                    { label: "Socket.IO (Library):", val: "Node wrapper library adding automatic reconnect loops, targeted rooms partitioning, and polling fallbacks." }
                  ]}
                ].map((panel, idx) => (
                  <div key={idx} className={`glass-panel p-6 rounded-2xl border ${panel.color} space-y-4 shadow-xl transition-all`}>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2.5 font-outfit">
                      <Terminal className="w-4 h-4 text-blue-400" />
                      {panel.title}
                    </h3>
                    <div className="text-xs space-y-3 leading-relaxed text-slate-300">
                      {panel.points.map((p, pIdx) => (
                        <p key={pIdx}>
                          <strong className="text-slate-100 font-semibold block text-[13px] mb-0.5">{p.label}</strong>
                          {p.val}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Elevator Pitch summary banner */}
              <div className="glass-panel p-6 rounded-3xl border border-blue-500/20 bg-blue-950/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-28 w-28 bg-blue-500/10 rounded-full blur-2xl"></div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 flex items-center gap-2 mb-3 font-mono">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Quick Project Elevator Pitch
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  "EduSync is an academic approval portal built on the MERN stack (React, Node, Express, MongoDB). For user sessions, we deploy stateless **JWTs** split into a short-lived access token stored in React memory and a long-lived refresh token secured in an **HttpOnly cookie** (defending against JavaScript XSS script attacks). Client queries use **Axios** (which runs response interceptors to refresh access keys on 401 errors automatically). We run **Socket.IO** for real-time notifications, placing clients in role-specific **Rooms** (like 'admins' or 'batch:CSE-3') to push notifications instantly."
                </p>
              </div>

              {/* List Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-white font-outfit">Interactive Subject Guide</h2>
                  <p className="text-xs text-slate-400 mt-1">Review, search, or toggle mastery status on questions.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)} 
                    className="bg-slate-900 border border-white/10 rounded-xl text-xs py-2.5 px-3 focus:outline-none focus:border-blue-500 text-white cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <option value="All">All Topics</option>
                    <option value="HTTP & APIs">HTTP & APIs</option>
                    <option value="React">React</option>
                    <option value="Express & Node">Express & Node</option>
                    <option value="MongoDB & Mongoose">MongoDB & Mongoose</option>
                    <option value="Security & JWT">Security & JWT</option>
                    <option value="Socket.IO">Socket.IO</option>
                    <option value="Project Architecture">Project Workflows</option>
                  </select>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search guide..." 
                      className="pl-9 pr-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-white placeholder-slate-500 w-48 hover:bg-slate-800 focus:bg-slate-900 transition-all shadow-md"
                    />
                  </div>

                  <button 
                    onClick={() => setAllCollapse(true)} 
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-[10.5px] font-extrabold tracking-wider uppercase px-4 py-2.5 rounded-xl active-press transition-all cursor-pointer"
                  >
                    Expand All
                  </button>
                  <button 
                    onClick={() => setAllCollapse(false)} 
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-[10.5px] font-extrabold tracking-wider uppercase px-4 py-2.5 rounded-xl active-press transition-all cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Question List Cards */}
              <div className="grid grid-cols-1 gap-4">
                {filteredQuestions.map((q, idx) => {
                  const isMastered = masteredQuestions[q.id];
                  const showAnswer = collapsedStates[q.id] !== false; // Default: show
                  return (
                    <motion.div
                      layout
                      key={q.id}
                      className={`glass-card p-6 rounded-2xl border transition-all duration-300 space-y-4 ${
                        isMastered ? 'mastered-glow' : 'border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-[10px] uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-md font-bold tracking-wider font-mono">
                          Q{idx + 1} • {q.category}
                        </span>
                        <div className="flex gap-2 shrink-0">
                          <button 
                            onClick={() => toggleCollapse(q.id)} 
                            className="text-[10.5px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-lg bg-slate-800 border border-white/5 text-slate-400 hover:text-white cursor-pointer active-press transition-colors"
                          >
                            {showAnswer ? 'Hide Answer' : 'Show Answer'}
                          </button>
                          <button 
                            onClick={() => toggleMastery(q.id)} 
                            className={`text-[10.5px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-lg border flex items-center gap-1 active-press cursor-pointer transition-all ${
                              isMastered 
                                ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400' 
                                : 'border-white/5 bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {isMastered ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />}
                            {isMastered ? 'Mastered' : 'Learn'}
                          </button>
                        </div>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white font-outfit tracking-wide leading-snug">{q.question}</h4>
                      
                      <AnimatePresence>
                        {showAnswer && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-black/35 p-5 rounded-2xl border border-white/5 space-y-2 mt-2">
                              <p className="text-[10px] text-blue-400 font-mono font-extrabold uppercase tracking-widest">Expected Viva Response:</p>
                              <p className="text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line">{q.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* TAB 2: CODE STRUCTURE INSPECTOR */}
          {activeTab === 'code-structure' && (
            <motion.section
              key="code-structure"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Directory Tree Panel */}
              <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 h-[580px] overflow-y-auto shadow-2xl space-y-4">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-3">
                  <FolderOpen className="w-5 h-5 text-indigo-400" />
                  EduSync Repository Tree
                </h3>
                <div className="font-mono text-xs space-y-1.5">
                  {/* Tree Renderer */}
                  {(() => {
                    const renderNode = (node, depth = 0) => {
                      const hasChildren = node.isDir && node.children && node.children.length > 0;
                      const isOpen = expandedNodes[node.name];
                      const isSelected = selectedNode && selectedNode.name === node.name;
                      
                      // Ext badge styling
                      let badge = null;
                      if (!node.isDir) {
                        const ext = node.name.split('.').pop();
                        if (ext === 'jsx') badge = 'jsx';
                        if (ext === 'js') badge = 'js';
                        if (ext === 'json') badge = 'json';
                      }

                      return (
                        <div key={node.name} className="space-y-1">
                          <div 
                            style={{ paddingLeft: `${depth * 14}px` }}
                            onClick={() => {
                              if (node.isDir) {
                                toggleTreeFolder(node.name);
                              }
                              setSelectedNode(node);
                            }}
                            className={`flex items-center justify-between py-1 px-2.5 rounded-lg cursor-pointer transition-all active-press group ${
                              isSelected ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {node.isDir ? (
                                isOpen ? <ChevronDown className="w-3.5 h-3.5 text-indigo-300" /> : <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                              ) : (
                                <FileCode2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              )}
                              <span className={`text-slate-300 font-mono select-none group-hover:text-white transition-colors ${isSelected ? 'text-white font-bold' : ''}`}>
                                {node.name}
                              </span>
                            </div>
                            
                            {badge && (
                              <span className={`text-[9px] font-extrabold uppercase font-mono px-1.5 py-0.5 rounded border ${
                                badge === 'jsx' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                badge === 'js' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                'bg-amber-600/10 text-amber-500 border border-amber-500/20'
                              }`}>
                                {badge}
                              </span>
                            )}
                          </div>

                          {node.isDir && isOpen && node.children.map(c => renderNode(c, depth + 1))}
                        </div>
                      );
                    };
                    return renderNode(PROJECT_TREE);
                  })()}
                </div>
              </div>

              {/* Inspector Details Panel */}
              <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 min-h-[500px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>
                
                <AnimatePresence mode="wait">
                  {selectedNode ? (
                    <motion.div
                      key={selectedNode.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-6 relative z-10"
                    >
                      <div className="flex justify-between items-start border-b border-white/10 pb-5">
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2.5 font-outfit">
                            {selectedNode.isDir ? <Folder className="w-6 h-6 text-indigo-400" /> : <FileCode2 className="w-6 h-6 text-blue-400" />}
                            {selectedNode.name}
                          </h3>
                          <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mt-1.5">
                            {selectedNode.isDir ? 'Directory' : 'Source File Code'}
                          </p>
                        </div>
                        {selectedNode.stackRole && (
                          <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-md border border-blue-500/20 font-bold font-mono uppercase tracking-wider shadow-sm">
                            {selectedNode.stackRole}
                          </span>
                        )}
                      </div>

                      <div className="space-y-5">
                        <div>
                          <h4 className="text-[10px] uppercase text-slate-400 font-extrabold tracking-widest mb-1.5">Stack Responsibility:</h4>
                          <p className="text-sm text-slate-200 leading-relaxed font-medium">{selectedNode.desc}</p>
                        </div>

                        {!selectedNode.isDir && (
                          <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 text-xs text-slate-300 leading-relaxed space-y-3 shadow-inner">
                            <span className="font-extrabold text-blue-400 block font-mono tracking-wider uppercase">MERN PIPELINE INTEGRATION:</span>
                            <p className="font-medium text-slate-300 leading-relaxed">
                              {selectedNode.name === 'axios.js' && 'Configures standard fetch clients. The response interceptor intercepts global 401 Unauthorized exceptions, triggers access token silent refreshes against backend auth APIs, and retries queries seamlessly without rendering user redirects.'}
                              {selectedNode.name === 'AuthContext.jsx' && 'Manages authentication context state. Tracks JWT string payloads, validates session intervals, and exports useContext triggers allowing views to control navigation scopes.'}
                              {selectedNode.name === 'SocketContext.jsx' && 'Hooks into global login flows. Connects to server endpoints, wraps auth tokens in handshake payloads, and broadcasts Socket object scopes across lists.'}
                              {selectedNode.name === 'authController.js' && 'Directs session routes: encrypts sign-ups, checks credentials, issues cookies, and runs memory map keys to check recovery OTPs via Nodemailer.'}
                              {selectedNode.name === 'requestController.js' && 'Performs database CRUD operations. Saves teacher updates in MongoDB, pulls HTTP Socket references via Express setups, and alerts admins room.'}
                              {selectedNode.name === 'authMiddleware.js' && 'Decodes Bearer authentication headers. Intercepts payloads, unpacks user identities, and validates user roles before endpoints run.'}
                              {selectedNode.name === 'User.js' && 'Maps Mongoose credentials parameters in collections. Uses pre-save database middleware triggers to hash password entries automatically via bcrypt.'}
                              {selectedNode.name === 'socketHandler.js' && 'Intercepts incoming websocket connections, decodes handshakes, and dynamically registers socket mappings to user or role rooms.'}
                              {selectedNode.name === 'index.js' && 'Sets up MongoDB configurations, mounts REST routing frameworks, binds client CORS middleware rules, and serves socket.io websockets.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-28 text-slate-500 space-y-4 my-auto relative z-10">
                      <div className="bg-slate-900 border border-white/10 p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-xl text-slate-400">
                        <Folder className="w-10 h-10 stroke-1" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-bold text-white font-outfit">Project Inspector Node</p>
                        <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">Select folder or file nodes from the tree view to inspect routing hooks, controller modules, or integration paths.</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5 mt-6 relative z-10">
                  <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-white block mb-0.5 font-semibold">Viva Exam Tip:</strong>
                    If asked where session access security checks occur, reference <span className="font-mono text-blue-300 font-bold">authMiddleware.js</span> for API points, and <span className="font-mono text-blue-300 font-bold">socketHandler.js</span> for real-time WebSocket entries.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* TAB 3: VISUAL TIMELINES */}
          {activeTab === 'visual-flow' && (
            <motion.section
              key="visual-flow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Flow Selector Tabs */}
              <div className="bg-gray-950/60 p-1.5 rounded-2xl border border-white/5 flex flex-wrap gap-1.5 max-w-fit shadow-lg backdrop-blur-xl">
                {[
                  { id: 'auth', label: 'JWT Authentication Loop', icon: '🔐' },
                  { id: 'socket', label: 'Socket.IO Broadcast Room', icon: '📡' },
                  { id: 'reset', label: 'OTP Password Recovery', icon: '🔑' }
                ].map(flow => (
                  <button
                    key={flow.id}
                    onClick={() => {
                      setSelectedFlow(flow.id);
                      setFlowStepIndex(0);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer active-press flex items-center gap-2 ${
                      selectedFlow === flow.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] border border-blue-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span>{flow.icon}</span>
                    {flow.label}
                  </button>
                ))}
              </div>

              {/* Main Grid: Timeline Steps + Detail Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Timeline Step List */}
                <div className="lg:col-span-4 space-y-2.5">
                  {currentFlowSteps.map((step, idx) => {
                    const isActive = idx === flowStepIndex;
                    const isPast = idx < flowStepIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setFlowStepIndex(idx)}
                        className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all duration-300 cursor-pointer active-press flex items-center gap-4 ${
                          isActive 
                            ? 'bg-blue-600/10 border-blue-500/30 text-white shadow-[0_0_25px_rgba(59,130,246,0.08)]' 
                            : isPast
                              ? 'bg-emerald-500/5 border-emerald-500/15 text-slate-300 hover:bg-emerald-500/10'
                              : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        <span className={`h-8 w-8 rounded-full font-mono text-xs flex items-center justify-center shrink-0 border-2 transition-all ${
                          isActive 
                            ? 'bg-blue-500/20 border-blue-400 text-blue-300 font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)]' 
                            : isPast
                              ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-400 font-bold'
                              : 'bg-white/5 border-white/10 text-slate-500'
                        }`}>
                          {isPast ? '✓' : idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : isPast ? 'text-slate-200' : 'text-slate-300'}`}>{step.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono font-medium mt-0.5 uppercase tracking-wider truncate">{step.activeRole}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Detail Panel */}
                <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col min-h-[520px]">
                  
                  {/* Panel Header */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-5">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-blue-400" />
                      Execution Log Panel
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5 font-semibold">
                      STEP {flowStepIndex + 1} / {currentFlowSteps.length}
                    </span>
                  </div>

                  {/* Animated Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${selectedFlow}-${flowStepIndex}`}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5 flex-1"
                      >
                        {/* Step Description Card */}
                        <div className="p-5 bg-gradient-to-br from-blue-950/30 to-indigo-950/20 rounded-2xl border border-blue-500/15">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 font-mono">{currentFlowSteps[flowStepIndex].activeRole}</span>
                          <h3 className="text-xl font-bold text-white mt-2 font-outfit tracking-wide">{currentFlowSteps[flowStepIndex].title}</h3>
                          <p className="text-sm text-slate-300 leading-relaxed mt-3 font-medium">{currentFlowSteps[flowStepIndex].desc}</p>
                        </div>

                        {/* Visual: Client ↔ Server Diagram */}
                        <div className="bg-slate-950/60 p-8 rounded-2xl border border-white/5 relative overflow-hidden shadow-inner">
                          {/* Grid overlay */}
                          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
                          
                          <div className="flex items-center justify-between w-full relative z-10 gap-4">
                            {/* Client Node */}
                            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${
                              currentFlowSteps[flowStepIndex].activeRole.includes('Client') || currentFlowSteps[flowStepIndex].activeRole.includes('React') || currentFlowSteps[flowStepIndex].activeRole.includes('Forgot')
                                ? 'scale-105' : 'opacity-50'
                            }`}>
                              <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                                currentFlowSteps[flowStepIndex].activeRole.includes('Client') || currentFlowSteps[flowStepIndex].activeRole.includes('React') || currentFlowSteps[flowStepIndex].activeRole.includes('Forgot')
                                  ? 'bg-blue-600/20 border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                                  : 'bg-slate-900 border-white/10'
                              }`}>
                                <Globe className={`w-8 h-8 transition-colors ${
                                  currentFlowSteps[flowStepIndex].activeRole.includes('Client') || currentFlowSteps[flowStepIndex].activeRole.includes('React') || currentFlowSteps[flowStepIndex].activeRole.includes('Forgot')
                                    ? 'text-blue-400' : 'text-slate-600'
                                }`} />
                              </div>
                              <span className="text-[11px] font-mono font-bold text-slate-300 tracking-wider">REACT CLIENT</span>
                            </div>

                            {/* Connection Line with Direction Arrow */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4">
                              <div className="w-full relative h-6 flex items-center">
                                {/* Base line */}
                                <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-blue-500/30 via-blue-400/60 to-indigo-500/30 rounded-full -translate-y-1/2"></div>
                                
                                {/* Animated dot traveling along the line */}
                                <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]" 
                                  style={{ 
                                    animation: currentFlowSteps[flowStepIndex].activeRole.includes('Server') || currentFlowSteps[flowStepIndex].activeRole.includes('API') || currentFlowSteps[flowStepIndex].activeRole.includes('Express') || currentFlowSteps[flowStepIndex].activeRole.includes('Nodemailer') || currentFlowSteps[flowStepIndex].activeRole.includes('Mongoose')
                                      ? 'travelRight 1.8s ease-in-out infinite alternate' 
                                      : 'travelLeft 1.8s ease-in-out infinite alternate',
                                  }}
                                ></div>

                                {/* Arrow head (right) */}
                                <div className={`absolute right-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                                  currentFlowSteps[flowStepIndex].activeRole.includes('Server') || currentFlowSteps[flowStepIndex].activeRole.includes('API') || currentFlowSteps[flowStepIndex].activeRole.includes('Express') || currentFlowSteps[flowStepIndex].activeRole.includes('Nodemailer') || currentFlowSteps[flowStepIndex].activeRole.includes('Mongoose')
                                    ? 'opacity-0' : 'opacity-100'
                                }`}>
                                  <ArrowLeft className="w-4 h-4 text-blue-400" />
                                </div>

                                {/* Arrow head (left) */}
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                                  currentFlowSteps[flowStepIndex].activeRole.includes('Client') || currentFlowSteps[flowStepIndex].activeRole.includes('React') || currentFlowSteps[flowStepIndex].activeRole.includes('Forgot')
                                    ? 'opacity-0' : 'opacity-100'
                                }`}>
                                  <ArrowRight className="w-4 h-4 text-indigo-400" />
                                </div>
                              </div>
                              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest bg-slate-900/80 px-2.5 py-1 rounded-md border border-white/5">
                                {currentFlowSteps[flowStepIndex].activeRole}
                              </span>
                            </div>

                            {/* Server Node */}
                            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${
                              currentFlowSteps[flowStepIndex].activeRole.includes('Server') || currentFlowSteps[flowStepIndex].activeRole.includes('API') || currentFlowSteps[flowStepIndex].activeRole.includes('Express') || currentFlowSteps[flowStepIndex].activeRole.includes('Nodemailer') || currentFlowSteps[flowStepIndex].activeRole.includes('Mongoose') || currentFlowSteps[flowStepIndex].activeRole.includes('MongoDB') || currentFlowSteps[flowStepIndex].activeRole.includes('Socket')
                                ? 'scale-105' : 'opacity-50'
                            }`}>
                              <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                                currentFlowSteps[flowStepIndex].activeRole.includes('Server') || currentFlowSteps[flowStepIndex].activeRole.includes('API') || currentFlowSteps[flowStepIndex].activeRole.includes('Express') || currentFlowSteps[flowStepIndex].activeRole.includes('Nodemailer') || currentFlowSteps[flowStepIndex].activeRole.includes('Mongoose') || currentFlowSteps[flowStepIndex].activeRole.includes('MongoDB') || currentFlowSteps[flowStepIndex].activeRole.includes('Socket')
                                  ? 'bg-indigo-600/20 border-indigo-400/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]'
                                  : 'bg-slate-900 border-white/10'
                              }`}>
                                <Terminal className={`w-8 h-8 transition-colors ${
                                  currentFlowSteps[flowStepIndex].activeRole.includes('Server') || currentFlowSteps[flowStepIndex].activeRole.includes('API') || currentFlowSteps[flowStepIndex].activeRole.includes('Express') || currentFlowSteps[flowStepIndex].activeRole.includes('Nodemailer') || currentFlowSteps[flowStepIndex].activeRole.includes('Mongoose') || currentFlowSteps[flowStepIndex].activeRole.includes('MongoDB') || currentFlowSteps[flowStepIndex].activeRole.includes('Socket')
                                    ? 'text-indigo-400' : 'text-slate-600'
                                }`} />
                              </div>
                              <span className="text-[11px] font-mono font-bold text-slate-300 tracking-wider">EXPRESS SERVER</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Footer */}
                    <div className="flex justify-between items-center pt-5 border-t border-white/10 mt-5">
                      <button 
                        onClick={() => setFlowStepIndex(prev => Math.max(0, prev - 1))} 
                        disabled={flowStepIndex === 0} 
                        className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer active-press flex items-center gap-2"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Previous
                      </button>
                      <div className="flex gap-1.5">
                        {currentFlowSteps.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setFlowStepIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              idx === flowStepIndex ? 'w-6 bg-blue-500' : idx < flowStepIndex ? 'w-2 bg-emerald-500/50' : 'w-2 bg-slate-700'
                            }`}
                          ></button>
                        ))}
                      </div>
                      <button 
                        onClick={() => setFlowStepIndex(prev => Math.min(currentFlowSteps.length - 1, prev + 1))} 
                        disabled={flowStepIndex === currentFlowSteps.length - 1} 
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-500/20 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer active-press flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.section>
          )}

          {/* TAB 4: MOCK VIVA QUIZ */}
          {activeTab === 'simulator' && (
            <motion.section
              key="simulator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {!quizActive ? (
                <div className="glass-panel p-8 sm:p-12 text-center rounded-3xl border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl"></div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-full border border-blue-400/20 text-white w-20 h-20 flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20">
                    <Brain className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">Mock Viva Exam Simulator</h3>
                    <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                      Test your knowledge using 10 random questions drawn from our database of MERN topics. Self-evaluate your answers to receive a confidence score.
                    </p>
                  </div>
                  <button 
                    onClick={startQuiz} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 mx-auto active-press transition-all cursor-pointer shadow-lg shadow-blue-500/25"
                  >
                    Start Simulator
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              ) : quizFinished ? (
                // Scores Display
                <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
                  <div className="text-center space-y-3">
                    <div className="bg-emerald-500/15 p-4 rounded-full border border-emerald-500/20 text-emerald-400 w-16 h-16 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">Simulation Report</h3>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">Scorecard detailing subject competency levels based on self-grading data.</p>
                  </div>

                  <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Overall Confidence Score</p>
                      <p className="text-4xl font-extrabold text-white mt-1 font-outfit tracking-tight">{quizConfidencePercent}%</p>
                    </div>
                    <div className="flex gap-4 text-xs font-semibold">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-slate-400">Nailed:</span> 
                        <span className="text-emerald-400 font-bold">{Object.values(quizScores).filter(s => s === 'good').length}</span>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
                        <span className="text-slate-400">Partial:</span> 
                        <span className="text-amber-400 font-bold">{Object.values(quizScores).filter(s => s === 'partial').length}</span>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
                        <span className="text-slate-400">Missed:</span> 
                        <span className="text-red-400 font-bold">{Object.values(quizScores).filter(s => s === 'poor').length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Topic Competency Breakdown:</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {(() => {
                        const breakdown = {};
                        quizQuestions.forEach(q => {
                          const score = quizScores[q.id];
                          if (!breakdown[q.category]) {
                            breakdown[q.category] = { count: 0, score: 0 };
                          }
                          breakdown[q.category].count += 1;
                          if (score === 'good') breakdown[q.category].score += 100;
                          if (score === 'partial') breakdown[q.category].score += 50;
                        });

                        return Object.entries(breakdown).map(([cat, stats]) => {
                          const scoreVal = Math.round(stats.score / stats.count);
                          return (
                            <div key={cat} className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-extrabold text-slate-200 font-outfit text-sm">{cat}</span>
                                <span className="text-slate-500 ml-1.5 font-medium">({stats.count} asked)</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-28 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/5">
                                  <div className={`h-full rounded-full ${scoreVal >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : (scoreVal >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-red-600 to-rose-400')}`} style={{ width: `${scoreVal}%` }}></div>
                                </div>
                                <span className="font-bold text-white w-8 text-right font-mono">{scoreVal}%</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <button 
                      onClick={startQuiz} 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold p-3.5 rounded-xl text-sm text-center active-press cursor-pointer shadow-lg shadow-blue-500/25"
                    >
                      Retake Quiz
                    </button>
                    <button 
                      onClick={() => setQuizActive(false)} 
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white border border-white/10 font-bold p-3.5 rounded-xl text-sm text-center active-press cursor-pointer"
                    >
                      Exit Simulator
                    </button>
                  </div>
                </div>
              ) : (
                // Active Quiz Card
                <div className="space-y-6">
                  {/* Progress Header */}
                  <div className="flex justify-between items-center bg-slate-900 border border-white/10 p-4 rounded-xl text-xs text-slate-400 font-semibold shadow-md">
                    <span>Question <span className="text-white font-bold">{quizIndex + 1}</span> of 10</span>
                    <div className="w-1/2 bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${quizProgressPercent}%` }}></div>
                    </div>
                    <span>Current Confidence: <span className="text-white font-bold">{quizConfidencePercent}%</span></span>
                  </div>

                  {/* Question */}
                  <div className="glass-panel p-8 rounded-3xl border border-blue-500/20 bg-blue-950/10 space-y-5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                    <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded border border-blue-500/20 font-semibold font-mono tracking-wide">
                      {quizQuestions[quizIndex]?.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug font-outfit">
                      {quizQuestions[quizIndex]?.question}
                    </h2>
                  </div>

                  {/* Reveal Trigger */}
                  {!quizRevealed ? (
                    <button 
                      onClick={() => setQuizRevealed(true)} 
                      className="w-full bg-slate-900/60 hover:bg-slate-800/60 text-white border border-white/10 hover:border-blue-500/30 p-10 rounded-3xl text-sm font-bold flex flex-col items-center justify-center gap-3.5 cursor-pointer transition-all active-press shadow-lg"
                    >
                      <div className="bg-slate-800 p-3 rounded-full border border-white/15 animate-pulse">
                        <Sparkles className="w-6 h-6 text-blue-400" />
                      </div>
                      <span>Reveal Correct Answer</span>
                    </button>
                  ) : (
                    // Answer Details
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.01] space-y-6 shadow-2xl"
                    >
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase text-blue-400 font-extrabold tracking-widest font-mono">Expected Response Structure:</h4>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                          {quizQuestions[quizIndex]?.answer}
                        </p>
                      </div>
                      
                      <div className="pt-5 border-t border-white/10 space-y-3">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rate your output confidence:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button 
                            onClick={() => handleGrade('good')} 
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 p-4 rounded-xl text-xs font-bold transition-all cursor-pointer active-press hover:border-emerald-500/30 flex items-center justify-center gap-2"
                          >
                            <Sparkles className="w-4 h-4" /> 🚀 Nailed it!
                          </button>
                          <button 
                            onClick={() => handleGrade('partial')} 
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 p-4 rounded-xl text-xs font-bold transition-all cursor-pointer active-press hover:border-amber-500/30 flex items-center justify-center gap-2"
                          >
                            <Globe className="w-4 h-4" /> 🟡 Partial recall
                          </button>
                          <button 
                            onClick={() => handleGrade('poor')} 
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-4 rounded-xl text-xs font-bold transition-all cursor-pointer active-press hover:border-red-500/30 flex items-center justify-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" /> 🔴 Forgot / Unsure
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button 
                    onClick={() => setQuizActive(false)} 
                    className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5 font-bold uppercase tracking-wider mx-auto cursor-pointer transition-colors active-press py-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Exit Quiz Session
                  </button>
                </div>
              )}
            </motion.section>
          )}

          {/* TAB 5: CHEATSHEET GLOSSARY */}
          {activeTab === 'cheatsheet' && (
            <motion.section
              key="cheatsheet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-white font-outfit">HTTP & Protocol Glossary</h2>
                  <p className="text-xs text-slate-400 mt-1">Definitions, HTTP codes, verbs, and architecture vocabulary.</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    value={glossarySearch}
                    onChange={(e) => setGlossarySearch(e.target.value)}
                    placeholder="Search definitions..." 
                    className="pl-9 pr-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-white placeholder-slate-500 w-64 hover:bg-slate-800 focus:bg-slate-900 transition-all shadow-md"
                  />
                </div>
              </div>

              {/* HTTP Verbs & Status Code tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Verbs Table */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 border-b border-white/5 pb-2.5 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    HTTP Methods (Verbs)
                  </h3>
                  <div className="space-y-4">
                    {[
                      { verb: "GET", color: "text-blue-400 bg-blue-500/10", title: "Read-Only Retrieval", desc: "Requests data from specified resource. GET requests are safe, cacheable, and must not modify database state (e.g. loading student circular logs)." },
                      { verb: "POST", color: "text-emerald-400 bg-emerald-500/10", title: "Create / Submit Resource", desc: "Submits request payload to create a new database resource or run action state side-effects (e.g. user authentication, OTP request validations)." },
                      { verb: "PUT", color: "text-amber-400 bg-amber-500/10", title: "Full Replaced Write", desc: "Overwrites the target database document with the complete new payload body values. Unspecified fields revert to defaults." },
                      { verb: "PATCH", color: "text-yellow-400 bg-yellow-500/10", title: "Partial Update", desc: "Applies partial changes to a document (e.g. updating a request status flag from pending to accepted, leaving other properties untouched)." },
                      { verb: "DELETE", color: "text-red-400 bg-red-500/10", title: "Removal Trigger", desc: "Removes targeted database documents matching params (e.g. user accounts deletion)." }
                    ].map(item => (
                      <div key={item.verb} className="flex items-start py-1 text-xs border-b border-white/5 last:border-0 pb-3">
                        <span className={`font-mono font-extrabold px-2 py-1 rounded-lg mr-3 shadow-sm select-none ${item.color}`}>{item.verb}</span>
                        <span className="text-slate-300 flex-1 leading-relaxed">
                          <strong className="text-white block font-medium mb-0.5">{item.title}</strong>
                          {item.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Codes Table */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 border-b border-white/5 pb-2.5 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    HTTP Status Codes
                  </h3>
                  <div className="space-y-4">
                    {[
                      { code: "200 OK", color: "text-emerald-400 bg-emerald-500/10", desc: "The request succeeded. Client fetches payloads or confirms status update." },
                      { code: "201 Created", color: "text-emerald-400 bg-emerald-500/10", desc: "The request succeeded and a new database resource document was created." },
                      { code: "400 Bad Request", color: "text-red-400 bg-red-500/10", desc: "Client request could not be processed due to invalid parameters or schemas validation." },
                      { code: "401 Unauthorized", color: "text-red-400 bg-red-500/10", desc: "Session identification verification failure. The auth token is missing, expired, or invalid." },
                      { code: "403 Forbidden", color: "text-red-400 bg-red-500/10", desc: "User identity is verified but lacks role scope permission validation to query the resource." },
                      { code: "404 Not Found", color: "text-red-400 bg-red-500/10", desc: "Requested URL route pattern or target object does not exist on the server." },
                      { code: "500 Server Err", color: "text-red-500 bg-red-500/10", desc: "Backend server crashed or database threw exceptions running controller logs." }
                    ].map(item => (
                      <div key={item.code} className="flex items-start py-1.5 text-xs border-b border-white/5 last:border-0 pb-3">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded-md mr-3 ${item.color}`}>{item.code}</span>
                        <span className="text-slate-300 flex-1 leading-relaxed">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Dynamic Terminology glossary list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GLOSSARY_TERMS.filter(t => {
                  return t.name.toLowerCase().includes(glossarySearch.toLowerCase()) || 
                         t.def.toLowerCase().includes(glossarySearch.toLowerCase());
                }).map(term => (
                  <div key={term.name} className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between shadow-lg hover:border-blue-500/20">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <h4 className="text-sm font-extrabold text-blue-400 font-mono tracking-wide">{term.name}</h4>
                        <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-widest">#MERN</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{term.def}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

        </AnimatePresence>
        
        {/* Footer */}
        <footer className="border-t border-white/10 pt-8 mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-semibold pb-16">
          <p>EduSync Standalone Viva Preparation Portal © 2026</p>
          <div className="flex gap-4">
            <span>Chitkara University CSE Viva Guide</span>
            <span>•</span>
            <span>MERN & Socket.IO Architecture</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
