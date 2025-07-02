# Chapter 2: Routing (React Router)

In the previous chapter, [Pages](01_pages.md), we learned that pages are like rooms in a house, each serving a different purpose in our application. But how do we move between these rooms? That's where **Routing** comes in!

Imagine you're using a website. You click on "About Us," and the page changes. You click on "Contact," and *that* page appears. Routing is the mechanism that makes this happen. It's the system of hallways and doors that connect all the rooms (pages) in our application.

In the `fleetpro-fleetmanagement` project, we use a library called **React Router** to handle routing. Think of React Router as the architect who designs the layout of our application, defining which URL leads to which page.

**Why Routing?**

Without routing, our application would be stuck on a single page! We wouldn't be able to navigate to different sections or access different features. Routing is essential for creating a multi-page application with a user-friendly experience.

**Central Use Case:**

Let's say our fleet manager wants to go to the "Vehicles" page to see a list of all their vehicles. Without routing, they'd have no way to get there directly. They'd have to scroll through a long, cluttered page, or maybe they couldn't even find the vehicles section at all. With routing, they can simply click a link or type `/vehicles` in the address bar, and *bam* – the Vehicles page appears!

**Key Concepts: `Routes`, `Route`, and `Link`**

React Router uses a few key components to manage navigation:

1.  **`<Routes>`:** Think of `<Routes>` as the main hallway in our house. It's the container that holds all the individual routes (the doors to the rooms). It looks at the current URL and decides which `<Route>` to display.

2.  **`<Route>`:**  Each `<Route>` is like a door to a specific room (page). It connects a URL path (like `/vehicles`) to a specific React component (like the `VehiclesPage`).

3.  **`<Link>`:** A `<Link>` is like a signpost or a door handle. It allows the user to click and navigate to a different URL. When you click a `<Link>`, React Router updates the URL in the browser, and the `<Routes>` component re-evaluates to display the corresponding `<Route>`.

**How to Use Routing**

Let's walk through the steps of setting up routing to display our `VehiclesPage` when the user navigates to `/vehicles`.

**Step 1: Install React Router**

First, make sure you have the `react-router-dom` library installed.  While it should be pre-installed in this project, in general you install it using npm or yarn:

```bash
npm install react-router-dom
# or
yarn add react-router-dom
```

**Step 2: Import Necessary Components**

In our main application file (usually `App.tsx`), we need to import the `<Routes>`, `<Route>`, and `<Link>` components from `react-router-dom`.

```tsx
import { Routes, Route, Link } from 'react-router-dom';
```

This line imports the necessary tools for setting up our routes and navigation.

**Step 3: Define the Routes**

Inside our `App` component, we use the `<Routes>` component to wrap our individual `<Route>` components. Each `<Route>` specifies a path and the component to render when that path is matched.

```tsx
function App() {
  return (
    <div>
      <Routes>
        <Route path="/vehicles" element={<VehiclesPage />} />
      </Routes>
    </div>
  );
}
```

This code says: "When the user navigates to `/vehicles`, render the `VehiclesPage` component." We're telling React Router which component (page) to show for a specific URL.

**Step 4: Create Links for Navigation**

To allow users to navigate to our `VehiclesPage`, we can use the `<Link>` component.

```tsx
function App() {
  return (
    <div>
      <Link to="/vehicles">Go to Vehicles Page</Link>
      <Routes>
        <Route path="/vehicles" element={<VehiclesPage />} />
      </Routes>
    </div>
  );
}
```

Now, the user will see a link that says "Go to Vehicles Page". Clicking this link will change the URL to `/vehicles` and the `VehiclesPage` component will be displayed.

**Step 5: Adding a Default Route**

It's good practice to have a default route, often the dashboard, which is displayed when the user visits the root URL (`/`).

```tsx
function App() {
  return (
    <div>
      <Link to="/vehicles">Go to Vehicles Page</Link>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
      </Routes>
    </div>
  );
}
```

Now, if a user just visits `/`, they will see the `DashboardPage`.

**Example in `App.tsx`**

Let's look at a snippet from the `App.tsx` file in `fleetpro-fleetmanagement`:

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import VehiclesPage from './pages/VehiclesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
```

This code snippet shows how the `DashboardPage` is connected to the root URL (`/`) and the `VehiclesPage` is connected to the `/vehicles` URL. The last route, `path="*"` is a catch-all. If the user visits a URL that doesn't match any of the defined routes, they'll be automatically redirected to the dashboard (`/`).

**Important Note:** The `<Navigate to="/" />` component performs the redirection.

**Internal Implementation: How React Router Works**

Let's break down what happens behind the scenes when a user clicks on a `<Link>` or types a URL into the browser.

First, here's a visual representation:

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Link Component
    participant React Router
    participant Page Component

    User->>Browser: Clicks on <Link>
    Browser->>Link Component: Handles click event
    Link Component->>React Router: Updates the URL
    React Router->>React Router: Matches URL to <Route>
    React Router->>Page Component: Renders the appropriate <Page>
    Page Component->>Browser: Sends HTML to the browser
    Browser->>User: Displays the new page
```

Here's a step-by-step explanation:

1.  **User Interaction:** The user clicks on a `<Link>` or enters a URL in the browser's address bar.

2.  **URL Update:** The `<Link>` component, managed by React Router, intercepts the click and updates the browser's URL without causing a full page reload. This is a key optimization that makes React applications feel fast and responsive.

3.  **Route Matching:** The `<Routes>` component in `App.tsx` (or wherever you define your routes) listens for changes in the URL. When the URL changes, `<Routes>` iterates through its child `<Route>` components to find a match.

4.  **Component Rendering:** Once a match is found, React Router renders the React component associated with that `<Route>`.

5.  **Page Display:** The rendered component updates the UI, displaying the new page to the user.

**Code Example:**

Here's how the routes are defined in the `App.tsx` file:

```tsx
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import VehiclesPage from './pages/VehiclesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
    </Routes>
  );
}
```

In this example, the `<Routes>` component is responsible for checking the URL and rendering the appropriate component. If the URL is `/`, the `DashboardPage` is rendered. If the URL is `/vehicles`, the `VehiclesPage` is rendered.

**Another important file is `components/Sidebar.tsx`:**

```tsx
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <NavLink to="/vehicles">Vehicles</NavLink>
  );
}
```

The `Sidebar.tsx` uses the `NavLink` component from react-router-dom. `NavLink` component create a link to the vehicles page and updates the UI accordingly when being clicked.

**In Summary:**

Routing is the mechanism that allows users to navigate between different pages in our application. React Router provides the `<Routes>`, `<Route>`, and `<Link>` components to manage this navigation.  By defining routes and creating links, we can create a user-friendly experience that allows users to easily access different sections of our application.

Now that we understand how routing works, let's move on to the next chapter: [React Components](03_react_components.md), where we'll dive deeper into the building blocks of our user interface.


---

Generated by [AI Codebase Knowledge Builder](https://github.com/The-Pocket/Tutorial-Codebase-Knowledge)