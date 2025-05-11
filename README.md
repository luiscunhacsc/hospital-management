[![Doutoramento Luís António Simões da Cunha Web 2.0 and Higher Education ...](https://tse2.mm.bing.net/th?id=OIP.PuG0HH7exucxPeNkhYN0JAHaE9\&pid=Api)](https://www.pinterest.de/pin/71565081549844203/)


# Hospital Management System

A full-stack Hospital Management System developed for educational purposes, initiated from a simple Entity and Relations (ER) file. This project serves as a practical exploration of building a system following principles akin to those of [JHipster](https://www.jhipster.tech/), utilizing a JDL (JHipster Domain Language) syntax file. The implementation was carried out step-by-step on both the backend and frontend, leveraging AI tools such as ChatGPT Plus 4o and Windsurf with ChatGPT 4.1.

## Project Overview

* **Objective**: To create a comprehensive Hospital Management System that manages patients, doctors, appointments, and other hospital-related entities.
* **Approach**: Utilized a JDL syntax file to define the system's entities and relationships, drawing inspiration from JHipster's methodology.
* **AI Integration**: Employed AI tools to assist in the development process, ensuring efficient and effective implementation.

## Technologies Used

* **Backend**:

  * Java with Spring Boot
  * RESTful APIs
  * JPA/Hibernate
  * H2 Database (for development and testing)([Cadena de Suministro][1], [A Televisão][2], [ResearchGate][3])

* **Frontend**:

  * React.js
  * Axios for API calls
  * Bootstrap for styling([Cadena de Suministro][1])

* **AI Tools**:

  * ChatGPT Plus 4o
  * Windsurf with ChatGPT 4.1([JusBrasil][4])

## Getting Started

### Prerequisites

* Java 17 or higher
* Node.js and npm
* Git

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/luiscunhacsc/hospital-management.git
   cd hospital-management
   ```



2. **Backend Setup**:

   ```bash
   cd hospital-management-backend
   ./mvnw spring-boot:run
   ```



The backend will start on `http://localhost:8080`.

3. **Frontend Setup**:

   ```bash
   cd hospital-management-frontend
   npm install
   npm start
   ```



The frontend will start on `http://localhost:3000`.

## Project Structure

* **hospital-management-backend**: Contains the Spring Boot application with all backend logic, including controllers, services, repositories, and entity definitions.
* **hospital-management-frontend**: Contains the React.js application with all frontend components, routes, and services.
* **JDL Hospital Management EN-US.txt**: The JDL file defining the entities and relationships used to generate the initial structure of the application.

## Features

* **Patient Management**: Add, view, update, and delete patient records.
* **Doctor Management**: Manage doctor profiles and their specialties.
* **Appointment Scheduling**: Schedule and manage appointments between patients and doctors.
* **Department Management**: Organize doctors and patients under specific hospital departments.
* **Authentication**: Secure login and role-based access control for different user types (e.g., admin, doctor, patient).

## Author

This project was developed by **Luís Simões da Cunha**, a professor at the Instituto Superior Miguel Torga, with extensive experience in both psychology and computer science. His academic and professional background includes a Ph.D. in Information Systems and a strong focus on integrating technology into educational contexts. ([LinkedIn][5])

## Acknowledgments

This project was developed with the assistance of AI tools, primarily ChatGPT Plus 4o and Windsurf with ChatGPT 4.1, which provided guidance and code suggestions throughout the development process.

## License

This project is open-source and available under the [MIT License](LICENSE).

---

Feel free to customize this README further to match any additional details or specific configurations related to your project.

