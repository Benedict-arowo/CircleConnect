# Project Name: CircleConnect

## Description
CircleConnect is a web application designed to facilitate the creation, management, and collaboration within circles or groups of users. The project provides a platform where users can register, join specific circles, and showcase their projects. Circle leaders and co-leaders have the authority to manage the circle's members and content, while members can collaborate on projects within the circle. The platform also allows non-registered users to access publicly shared circle projects.

## Tech Stack
- **ExpressJS:** A robust and popular Node.js web application framework for building the backend.
- **ReactJS:** A powerful JavaScript library for creating dynamic and interactive user interfaces.
- **Material UI or Chakra UI and Tailwind:** UI libraries to enhance the visual appeal and user experience of the application.
- **Cloudinary:** A cloud-based image and video management platform for storing and serving multimedia content.
- **PostgreSQL:** A reliable and scalable open-source relational database for data storage.
- **OAuth:** A secure and standardized protocol for user authentication and authorization.

## Features

### User Registration and Authentication
- Users can create accounts and log in using OAuth for a secure and seamless registration process.

### Circles
- Users can create circles or groups, serving as a space for collaboration and project sharing.
- Each circle has a designated leader and co-leader who can manage circle membership and content.

### Circle Membership
- Users can request to join a circle or be invited by a circle leader.
- Circle leaders have the authority to approve or reject membership requests.

### Project Showcase
- Circle members can showcase their projects within the circle.
- Projects can be categorized and presented in an organized manner.

### Public Access to Circle Projects
- Circle leaders can choose to make specific projects publicly accessible, allowing non-registered users or users not in the circle to view them.
- Public projects are displayed on a dedicated page for each circle, promoting transparency and collaboration.

## Setup and Installation
1. Clone the repository from GitHub: `git clone <repository_url>`
2. Navigate to the project directory: `cd CircleConnect`
3. Install the required dependencies for the backend using npm or yarn: `npm install` or `yarn install`
4. Navigate to the client directory: `cd client`
5. Install the required dependencies for the frontend: `npm install` or `yarn install`
6. Set up your PostgreSQL database and Cloudinary account, and update the configuration files accordingly.
7. Create a `.env` file in the root directory and configure environment variables, including database credentials, OAuth settings, and Cloudinary API keys.
8. Start the server and frontend development servers separately.

```bash
# Start the server
cd ../
npm start

# Start the client (in another terminal)
cd client/
npm start
