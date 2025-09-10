# Tutorial: Fleetpro-fleetmanagement

This project is a web application for **managing vehicle fleets** (like trucks) and handling **wholesale financing** for dealerships.
It allows users to view vehicle details, track trips, manage maintenance, monitor alerts, log costs, and also handle dealership credit lines and financed inventory.
The app structure uses **React** for building *pages* and *components*, with data managed in the main application state, mimicking a real backend interaction.


## Visual Overview

```mermaid
flowchart TD
    A0["Data Types (Interfaces & Enums)
"]
    A1["Application Structure & Routing
"]
    A2["Vehicles (Fleet Entity)
"]
    A3["Dealerships (Wholesale Entity)
"]
    A4["Trips (Fleet Feature)
"]
    A5["Inventory (Wholesale Feature)
"]
    A6["Pages
"]
    A7["Data Management (Mock)
"]
    A8["External Services
"]
    A9["Reusable UI Components
"]
    A0 -- "Defines Structures" --> A7
    A0 -- "Defines Input/Output" --> A8
    A1 -- "Renders" --> A6
    A1 -- "Uses UI" --> A9
    A7 -- "Provides Data" --> A6
    A6 -- "Calls Actions" --> A7
    A6 -- "Uses Services" --> A8
    A6 -- "Uses Components" --> A9
    A2 -- "Displayed On" --> A6
    A3 -- "Displayed On" --> A6
    A4 -- "Displayed On" --> A6
    A5 -- "Displayed On" --> A6
    A4 -- "Assigns" --> A2
    A5 -- "Belongs To" --> A3
    A9 -- "Switches Context" --> A1
```

## Chapters

1. [Vehicles (Fleet Entity)
](/tutorial/01_vehicles__fleet_entity__.md)
2. [Dealerships (Wholesale Entity)
](/tutorial/02_dealerships__wholesale_entity__.md)
3. [Trips (Fleet Feature)
](/tutorial/03_trips__fleet_feature__.md)
4. [Inventory (Wholesale Feature)
](/tutorial/04_inventory__wholesale_feature__.md)
5. [Pages
](/tutorial/05_pages_.md)
6. [Reusable UI Components
](/tutorial/06_reusable_ui_components_.md)
7. [Application Structure & Routing
](/tutorial/07_application_structure___routing_.md)
8. [Data Types (Interfaces & Enums)
](/tutorial/08_data_types__interfaces___enums__.md)
9. [Data Management (Mock)
](/tutorial/09_data_management__mock__.md)
10. [External Services
](/tutorial/10_external_services_.md)
11. [AI_service_integration__gemini
](/tutorial/11_ai_service_integration__gemini_.md)


---
