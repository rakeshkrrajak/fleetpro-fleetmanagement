 Chapter 6: Reusable UI Components

Welcome back to the FleetPro tutorial! In the [previous chapter](05_pages_.md), we learned about **Pages** – the distinct screens users interact with in our application, like the "Vehicles Page" or the "Trips Page". We saw how pages bring together data and user actions for a specific view.

Now, let's look at the smaller building blocks that pages (and other parts of the application) are made of. Imagine building a large house. You don't build each wall or window uniquely from scratch every time. You use standard bricks, pre-made window frames, and common door types. This saves time, ensures consistency, and makes repairs easier.

In software development, especially for user interfaces, we do something similar with **Reusable UI Components**.

## What are Reusable UI Components?

Reusable UI Components are like the standard bricks, windows, and doors of our FleetPro application. They are small, self-contained pieces of the user interface designed to be used over and over again in different places.

Their main goals are:

1.  **Consistency:** Ensure that elements like buttons, input fields, or pop-up windows look and behave the same way throughout the entire application.
2.  **Efficiency (Don't Repeat Yourself - DRY):** Avoid writing the same code multiple times for the same type of UI element. Write it once as a component, and then use that component wherever needed.
3.  **Maintainability:** If you need to change how all buttons look (e.g., change their color or shape), you only need to change the code in *one* place (the Button component), and the change will automatically apply everywhere that component is used.

Examples of reusable UI components in FleetPro include:

*   **Buttons:** Used for submitting forms, canceling actions, adding new items, etc.
*   **Input Fields & Dropdowns:** Used in forms to collect user input.
*   **Modals:** Pop-up windows used for displaying forms (like "Add Vehicle") or confirmation messages.
*   **Sidebars:** The navigation menus on the left side of the screen.
*   **Cards:** Used to display summarized information about an item (like a vehicle or a trip) in a list or grid format.
*   **Logos:** The FleetPro and Wholesale Finance logos.
*   **App Switcher:** The button to switch between Fleet Management and Wholesale Finance.

These components are typically smaller than a whole page and focus on one specific piece of UI or interaction.

## Core Use Case: Building a User Interface with Standardized Elements

The main use case is simply creating the visual interface for any page or section of the app by assembling these pre-built pieces.

Instead of writing the HTML, CSS, and JavaScript logic for a "Save" button every single time we need one on a form (on the Vehicles page, Trips page, Dealerships page, etc.), we create a generic `Button` component. Then, on each form, we just say "render a Button component here, with the text 'Save' and this function to call when clicked".

## How Reusable Components Work (The Magic of Props)

How can one Button component be used for "Save", "Cancel", "Add New", or "Delete"? How can one Modal component show different titles and different content inside?

The answer is **Props**.

"Props" (short for "properties") are how you pass data and functions *into* a reusable component to customize it for a specific use case.

Think of it like ordering a pizza:
*   The `Pizza` component is the base.
*   `Props` are the toppings, size, and crust type you specify in your order.
*   You order a Large Pepperoni Pizza (using the Pizza component with specific props).
*   Someone else orders a Small Veggie Pizza (using the *same* Pizza component, but with different props).

Let's look at a few examples from the FleetPro project code snippets you've seen:

### Example 1: The Modal Component (`components/Modal.tsx`)

This component creates a standard pop-up dialog window. It can be used anywhere you need to show content on top of the current page.

Here's a simplified look at how a Page component (like `VehiclesPage` from Chapter 5) *uses* the `Modal`:

```typescript
// Inside VehiclesPage.tsx (simplified)
// ... state to control if modal is open ...
const [isModalOpen, setIsModalOpen] = useState(false);
const closeModal = () => setIsModalOpen(false);

return (
    <div>
        {/* ... rest of the page content ... */}

        {/* Using the Modal component */}
        <Modal 
            isOpen={isModalOpen} // Prop 1: Should the modal be visible?
            onClose={closeModal} // Prop 2: What happens when the user clicks close?
            title="Add New Vehicle" // Prop 3: What title to show at the top?
            size="3xl" // Prop 4: How wide should it be?
        >
            {/* Prop 5: 'children' - the content *inside* the modal */}
            <VehicleForm 
               // ... props for the VehicleForm itself ...
            />
        </Modal>
    </div>
);
```
**Explanation:**
*   The `VehiclesPage` component *renders* the `Modal` component.
*   It passes several **props** to the `Modal`: `isOpen`, `onClose`, `title`, and `size`. These props tell the `Modal` how to behave and what text to display in its header.
*   The content placed *between* the opening and closing `<Modal>` tags (`<VehicleForm ... />`) becomes the `children` prop. This is a special prop that allows components to wrap other content.

Now, let's look at a simplified snippet from the `Modal.tsx` component definition itself:

```typescript
// Inside components/Modal.tsx (simplified)
import React from 'react';

interface ModalProps {
  isOpen: boolean; // Expects a boolean value
  onClose: () => void; // Expects a function
  title: string; // Expects a string value
  children: React.ReactNode; // Expects React content (JSX, other components)
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'; // Optional prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null; // Don't render if isOpen is false

  // ... logic to determine size classes based on 'size' prop ...
  const sizeClasses = { /* ... */ };

  return (
    <div className="..."> {/* Background overlay */}
      <div className={`... ${sizeClasses[size]}`}> {/* The modal content area */}
        <div className="..."> {/* Header */}
          <h3 className="...">{title}</h3> {/* Display the 'title' prop */}
          <button onClick={onClose}> {/* Call the 'onClose' function prop */}
             {/* ... close icon ... */}
          </button>
        </div>
        <div className="..."> {/* Body */}
          {children} {/* Render the content passed via the 'children' prop */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
```
**Explanation:**
*   The `Modal` component is defined as a function that accepts `ModalProps`.
*   Inside the function, it uses the values passed via props (`isOpen`, `title`, `children`, `onClose`).
*   The `title` prop is used to display the modal's title.
*   The `onClose` prop (a function) is attached to the close button's `onClick` event.
*   The `children` prop is rendered directly inside the modal's body, making the modal component a "container" for other content.
*   The `size` prop controls which CSS classes are applied to change the modal's width.

This shows how a single `Modal` component can be reused to display different titles and different content (`children`) just by providing different props when you use it.

### Example 2: The Sidebar Components (`components/Sidebar.tsx`, `components/WholesaleSidebar.tsx`)

The navigation sidebars are another great example of reusable components. The Fleet Management sidebar and the Wholesale Finance sidebar are slightly different in content but share a similar structure and styling. They also use smaller components for individual navigation links and the app switcher.

Here's how the main `App.tsx` component uses the Sidebar and WholesaleSidebar (as seen in Chapter 5 context):

```typescript
// Inside App.tsx (simplified)
// ... state for currentApp ('fleet' or 'wholesale') ...
const [currentApp, setCurrentApp] = useState<'fleet' | 'wholesale'>('fleet');

return (
  <div className="app-container">
    {/* Conditionally render the correct sidebar component */}
    {currentApp === 'fleet' ? (
      <Sidebar currentApp={currentApp} setCurrentApp={setCurrentApp} />
    ) : (
      <WholesaleSidebar currentApp={currentApp} setCurrentApp={setCurrentApp} />
    )}
    <main className="page-content">
      {/* ... Routing logic displays the current Page component ... */}
    </main>
  </div>
);
```
**Explanation:**
*   `App.tsx` decides which sidebar to show based on the `currentApp` state.
*   It renders either `Sidebar` or `WholesaleSidebar`, passing the `currentApp` state and the `setCurrentApp` function as **props** to both.

Now let's look at simplified snippets from the sidebar components. Notice they both use an `AppSwitcher` component and define how their specific navigation links are rendered.

```typescript
// Inside components/Sidebar.tsx (simplified)
import React from 'react';
import { NavLink } from 'react-router-dom'; // For navigation links
import AppSwitcher from './AppSwitcher'; // Reusable AppSwitcher component
import FleetProLogo from './FleetProLogo'; // Reusable Logo component
// NAVIGATION_ITEMS are imported from constants, not passed as a prop in this case

interface SidebarProps {
  currentApp: 'fleet' | 'wholesale';
  setCurrentApp: (app: 'fleet' | 'wholesale') => void;
}

// A reusable component *just* for a single navigation link
const SidebarNavLink: React.FC<{ item: any; isSubItem?: boolean }> = ({ item, isSubItem = false }) => {
    return (
        <NavLink to={item.path} className={({ isActive }) => 
            `... shared styles ... ${isActive ? '... active styles ...' : '... inactive styles ...'}`
        }>
            {/* Uses item.icon and item.name from props */}
            <item.icon className="..." /> 
            <span>{item.name}</span>
        </NavLink>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ currentApp, setCurrentApp }) => {
  // ... state for submenu logic ...

  return (
    <div className="w-72 ... flex flex-col ...">
      <div className="p-5 ...">
        <FleetProLogo /> {/* Reusable Logo component */}
      </div>
      {/* Reusable AppSwitcher component, using props */}
      <AppSwitcher currentApp={currentApp} setCurrentApp={setCurrentApp} /> 
      <nav className="flex-grow p-5 space-y-2 overflow-y-auto border-t border-gray-700">
        {/* Loops through navigation items (from imported constant) */}
        {/* For simplicity, ignoring submenu logic here */}
        {NAVIGATION_ITEMS.map(item => (
             // Uses the reusable SidebarNavLink for each item
             <SidebarNavLink key={item.name} item={item} /> 
        ))}
      </nav>
       {/* ... footer ... */}
    </div>
  );
};

export default Sidebar;

// The WholesaleSidebar.tsx component is very similar, using WholesaleFinanceLogo,
// WHOLESALE_NAVIGATION_ITEMS, and a similar structure.
```
**Explanation:**
*   The `Sidebar` component accepts `currentApp` and `setCurrentApp` as props and passes them down to the `AppSwitcher` component.
*   It uses two other reusable components: `FleetProLogo` and `AppSwitcher`.
*   It defines and uses a smaller reusable component, `SidebarNavLink`, specifically for rendering each item in the navigation list. It loops through the `NAVIGATION_ITEMS` data (imported from a constant) and creates one `SidebarNavLink` component for each item, passing the item's data as a prop.
*   The `SidebarNavLink` component itself takes an `item` prop and uses its data (like `item.icon` and `item.name`) and path (`item.path`) to render a single clickable link.

This shows how reusable components can be nested within other components (`Sidebar` uses `AppSwitcher` and `SidebarNavLink`), and how they use props to display specific data (the item's name/icon/path) and handle interactions (the link click handled by `NavLink`).

Other components like `AppSwitcher` and the Logo components (`FleetProLogo`, `WholesaleFinanceLogo`) are also simple examples of reusable components that encapsulate specific UI elements and their styling.

### Summary of Key Reusable Components in the Project Snippets

Here's a table summarizing some of the reusable components seen or mentioned in the provided code snippets and their main purpose/props:

| Component           | Purpose                                   | Key Props Received                     | Used by Examples                      |
| :------------------ | :---------------------------------------- | :------------------------------------- | :------------------------------------ |
| `Modal`             | Show content in a pop-up overlay          | `isOpen`, `onClose`, `title`, `children`, `size` | `VehiclesPage`, `DealershipsPage`, `TripsPage`, `InventoryPage` (for forms) |
| `Sidebar`           | Fleet navigation menu                     | `currentApp`, `setCurrentApp`          | `App.tsx`                             |
| `WholesaleSidebar`  | Wholesale navigation menu                 | `currentApp`, `setCurrentApp`          | `App.tsx`                             |
| `SidebarNavLink`    | Single item in the sidebar navigation     | `item` (data like name, path, icon), `isSubItem` | `Sidebar`, `WholesaleSidebar`         |
| `AppSwitcher`       | Button to switch between apps             | `currentApp`, `setCurrentApp`          | `Sidebar`, `WholesaleSidebar`         |
| `FleetProLogo`      | FleetPro branding/logo SVG                | Standard SVG props                     | `Sidebar`                             |
| `WholesaleFinanceLogo`| Wholesale Finance branding/logo SVG       | Standard SVG props                     | `WholesaleSidebar`                    |
| `VehicleForm`       | Form for adding/editing vehicle details   | `onSubmit`, `onCancel`, `initialData`, `vehicles`, `drivers` | `VehiclesPage` (inside Modal)       |
| `TripForm`          | Form for planning/editing trips           | `onSubmit`, `onCancel`, `initialData`, `vehicles`, `drivers`, `costCategories` | `TripsPage` (inside Modal)          |
| `FundInventoryForm` | Form for funding new inventory            | `onSubmit`, `onCancel`, `dealerships`  | `InventoryPage` (inside Modal)      |
| `RepayInventoryForm`| Form for repaying inventory             | `onSubmit`, `onCancel`, `unit`         | `InventoryPage` (inside Modal)      |

Notice how forms (`VehicleForm`, `TripForm`, etc.) are also often treated as reusable components, even if they are primarily used on one specific page. This is because they encapsulate the form logic and structure, making the page component cleaner. They receive data to pre-fill (like `initialData`) and an `onSubmit` function to call when done.

## Under the Hood: Creating a Reusable Component

Building a reusable component typically involves a few steps:

1.  **Decide what it does:** What piece of UI or functionality does this component represent? (e.g., "a button", "a pop-up", "a form field").
2.  **Define its Props:** What information does this component need from the outside world to be flexible? What functions should it be able to call back to its parent? You often define an `interface` (like `ModalProps`) to specify the name and type of each prop.
3.  **Write the JSX:** Write the HTML-like code that defines the structure of the component's UI.
4.  **Use the Props:** Access the values and functions passed via props inside the component's logic and JSX (`props.title`, `props.onClose()`, `{props.children}`).
5.  **Add Styling:** Apply CSS or styling classes to make it look right.
6.  **Place the file:** Organize components in a dedicated folder (like `components/`).

Here's a tiny conceptual example of a very simple `Button` component:

```typescript
// Inside components/Button.tsx
import React from 'react';

interface ButtonProps {
  onClick: () => void; // What happens when it's clicked?
  children: React.ReactNode; // The text or content inside the button
  disabled?: boolean; // Is the button disabled? (Optional prop)
  style?: React.CSSProperties; // Optional custom styles
}

const Button: React.FC<ButtonProps> = ({ onClick, children, disabled = false, style }) => {
  return (
    <button
      onClick={onClick} // Use the onClick prop
      disabled={disabled} // Use the disabled prop
      style={style} // Use the style prop
      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50" // Example styling
    >
      {children} {/* Render the content from the children prop */}
    </button>
  );
};

export default Button;
```

Then, a page would *use* it like this:

```typescript
// Inside some Page component
import Button from '../components/Button'; // Import the component

const MyPage = () => {
  const handleSave = () => {
    alert('Saving!');
  };

  const handleCancel = () => {
    alert('Cancelled!');
  };

  return (
    <div>
      {/* ... page content ... */}
      
      {/* Using the reusable Button component */}
      <Button onClick={handleSave} style={{ marginRight: '10px' }}>
        Save Changes {/* This text becomes 'children' prop */}
      </Button>
      
      <Button onClick={handleCancel} disabled={false}>
        Cancel {/* This text becomes 'children' prop */}
      </Button>

      <Button onClick={() => console.log('Disabled button clicked')} disabled={true}>
        Can't Click Me
      </Button>
    </div>
  );
};
```
This simple example shows how the same `Button` component is used multiple times, with different props (`onClick`, `children`, `disabled`), to perform different actions and display different text, while maintaining a consistent look.

Reusable components are a cornerstone of modern UI development. They make building complex applications much more manageable, faster, and easier to update.

## Conclusion

In this chapter, we explored **Reusable UI Components**. We learned that they are standardized building blocks like Buttons, Modals, and Sidebars, designed to promote consistency, avoid code duplication (DRY), and improve maintainability. We saw how the crucial concept of **Props** allows us to customize these components with specific data and behavior when we use them on different pages or in different contexts. We looked at examples from the FleetPro project's code to see how components like `Modal`, `Sidebar`, and `AppSwitcher` are defined and used.

Understanding reusable components is key to seeing how the visual parts of FleetPro are assembled efficiently and consistently. Next, we'll zoom out to see how these pages and components are organized and how the application knows which page to show when.

[Next Chapter: Application Structure & Routing](07_application_structure___routing__.md)

---

<sub><sup>**References**: [[1]](https://github.com/rakeshkrrajak/fleetpro-fleetmanagement/blob/7b84d99e0dc11a8c8350b388be15b56727655e66/components/AppSwitcher.tsx), [[2]](https://github.com/rakeshkrrajak/fleetpro-fleetmanagement/blob/7b84d99e0dc11a8c8350b388be15b56727655e66/components/FleetProLogo.tsx), [[3]](https://github.com/rakeshkrrajak/fleetpro-fleetmanagement/blob/7b84d99e0dc11a8c8350b388be15b56727655e66/components/Modal.tsx), [[4]](https://github.com/rakeshkrrajak/fleetpro-fleetmanagement/blob/7b84d99e0dc11a8c8350b388be15b56727655e66/components/Sidebar.tsx), [[5]](https://github.com/rakeshkrrajak/fleetpro-fleetmanagement/blob/7b84d99e0dc11a8c8350b388be15b56727655e66/components/WholesaleFinanceLogo.tsx), [[6]](https://github.com/rakeshkrrajak/fleetpro-fleetmanagement/blob/7b84d99e0dc11a8c8350b388be15b56727655e66/components/WholesaleSidebar.tsx)</sup></sub>