# CircleConnect

## Description

**CircleConnect** is a versatile web application designed to empower users to effortlessly create and manage circles or groups, facilitating project sharing, collaboration, and transparency. Mainly developed as part of a backend engineering course I am currently taking, this platform is tailored to course participants looking to showcase their projects and collaborate with peers.

## Tech Stack

-   **ExpressJS:** A robust and popular Node.js web application framework for building the backend.
-   **ReactJS:** A powerful JavaScript library for creating dynamic and interactive user interfaces.
-   **Chakra UI and Tailwind:** UI libraries to enhance the visual appeal and user experience of the application.
-   **Cloudinary:** A cloud-based image and video management platform for storing and serving multimedia content.
-   **PostgreSQL:** A reliable and scalable open-source relational database for data storage.
-   **OAuth:** A secure and standardized protocol for user authentication and authorization.

## Features

#### Sets

-   Circle's and their project's being categorized into sets. Eg (2020 Set, 2021 Set)

#### Semester

-   Have circle's be categorized into semesters. Since there are three semesters per sets.

#### User Registration and Authentication

-   [x] Users can create accounts and log in using OAuth for a secure and seamless registration process.

#### Circles

-   [x] Users can create circles(groups), serving as a space for collaboration and project sharing.
-   [x] Each circle has a designated leader and co-leader who can manage circle membership and content.

#### Circle Membership

-   [x] Users can request to join a circle.
-   [x] Circle leaders have the authority to approve or reject membership requests.

#### Project Showcase

-   Circle members can showcase their projects within the circle.
-   Projects can be categorized and presented in an organized manner.

#### Public Access to Circle Projects

-   [x] Circle leaders can choose to make specific projects publicly accessible, allowing non-registered users or users not in the circle to view them.
-   Public projects are displayed on a dedicated page for each circle, promoting transparency and collaboration.

#### Project Page

-   Displays more information about the specified project.
-   Review Component where outsiders can leave their reviews and rate
    the project.

#### Circle Settings Page:

-   Ability for circle leader to toggle between allowing user’s to be able to make projects private themselves or require permission from the circle leader.
-   Ability to generate circle invite link which they can send to their
    members.

#### About Us Page:

-   A page about the project, why we built it, and our socials.

## Setup and Installation

-   Coming Soon

### TODO:

-   Project Page

    -   Create a new project
    -   Manage project page (A list of user's projects so they can edit, or delete them).
    -   Ability to be able to add reviews to projects.
    -   Ability to be able to rate the projects.
    -   Possibly use github's API to get more info about projects.

-   Circle Page
    -   Create a new circle
