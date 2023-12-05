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

-   Users can create accounts and log in using OAuth for a secure and seamless registration process.

#### Circles

-   Users can create circles(groups), serving as a space for collaboration and project sharing.
-   Each circle has a designated leader and co-leader who can manage circle membership and content.

#### Circle Membership

-   Users can request to join a circle or be invited by a circle leader.
-   Circle leaders have the authority to approve or reject membership requests.

#### Project Showcase

-   Circle members can showcase their projects within the circle.
-   Projects can be categorized and presented in an organized manner.

#### Public Access to Circle Projects

-   Circle leaders can choose to make specific projects publicly accessible, allowing non-registered users or users not in the circle to view them.
-   Public projects are displayed on a dedicated page for each circle, promoting transparency and collaboration.

#### Project Page

-   Displays more information about the specified project.
-   Review Component where outsiders can leave their reviews and rate
    the project.

#### Circle Settings Page:

-   Make circle private or public. (If circle is private, that means it will only be accessible by circle members.)
-   Ability for circle leader to toggle between allowing user’s to be able to make projects private themselves or require permission from the circle leader.
-   Ability to generate circle invite link which they can send to their
    members.

#### About Us Page:

-   A page about the project, why we built it, and our socials.

## API Routes

### Circles

#### Get All Circles

-   **URL:** `/api/circle`
-   **Method:** `GET`
-   **Description:** Retrieves a list of all circles.
-   **Query parameters:**
    -   `limit` -- `/api/circle?limit=10` -- Specifies the maximum amount of circles it should return. The maximum value you may input is `25`
    -   `sortedBy`-- `/api/circle?sortedBy=num-asc`
        -   Possible values: `num-asc,  num-desc,  rating-asc,  rating-desc`

#### Get Circle by ID

-   **URL:** `/api/circle/:id`
-   **Method:** `GET`
-   **Description:** Retrieves details of a specific circle by ID.

#### Create Circle

-   **URL:** `/api/circle`
-   **Method:** `POST`
-   **Description:** Creates a new circle.
-   **Request Body:**
    ```json
    {
    	"circle_num": 1,
    	"description": "A cool circle with cool people."
    }
    ```
    circle_num, and description are both required fields. Description has a minimum character length which is specified in the `utils.ts` file, and a maximum character length which is 300.

#### Request to Join Circle

-   **URL:** `/api/circle/request/join/:circleId`
-   **Method:** `POST`
-   **Description:** Creates a join request on a circle.

#### Remove Request to Join Circle

-   **URL:** `/api/circle/request/leave/:circleId`
-   **Method:** `POST`
-   **Description:** Removes a join request on a circle.

#### Edits Circle

-   **URL:** `/api/circle/:circleId`
-   **Method:** `PATCH`
-   **Description:** Edits a circle
-   **Query parameters:**
    -   `leaveCircle` -- `/api/circle?leaveCircle=true` -- Leaves the circle.
-   **Request Body:**
    ```json
    {
      "description"?: "A cool circle with cool people."
      "request"?: {
        "type": "ACCEPT|DECLINE"
        "userId": "valid userId"
        },
    "removeUser"?: {
    	"userId": "valid userId"
    	}
    }
    ```

#### Delete Circle

-   **URL:** `/api/circle/:circleId`
-   **Method:** `DELETE`
-   **Description:** Deletes a circle

## Setup and Installation

-   Coming Soon
