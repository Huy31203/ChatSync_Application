# ChatSync

ChatSync is a real-time chatting application designed for seamless communication. The project leverages a modern tech stack, combining a highly interactive frontend with a robust and secure backend.

## Previews:
- **Login page:**

![image](https://github.com/user-attachments/assets/ffca3982-a835-4fd9-85f1-e1904f4fde73)

- **Sign up page:**

![image](https://github.com/user-attachments/assets/3bce9509-98b3-4ea1-b6fb-424965f4383d)

- **Home page:**

![image](https://github.com/user-attachments/assets/ffef3a18-6b60-489e-87ac-d993ca73483d)

- **Channel page:**

![image](https://github.com/user-attachments/assets/91ef0d5f-6935-47ac-b3be-826b1f2f508a)

- **Conversation page:**

![image](https://github.com/user-attachments/assets/a7d23c6e-c8bb-4129-a2e6-31d0e80e36bb)

## Tech Stack

### Frontend

- **Next.js 15:** The foundation of our frontend, providing server-side rendering and fast performance.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Shadcn UI:** A set of accessible and customizable UI components.
- **Axios:** For handling HTTP requests to the backend.
- **Zustand:** A lightweight state management solution for React.
- **SockJS:** A JavaScript library that provides a WebSocket-like object in environments that do not support WebSockets, enabling real-time, bidirectional communication.

### Backend

The backend is built using Spring Boot and is managed with Gradle. Key dependencies include:

- **Spring Messaging & WebSocket:** Enables real-time communication.
- **Spring Boot Starters:** For actuator, data JPA, security, web, validation, and Thymeleaf.
- **OAuth2:** For secure resource server and client implementations.
- **Springdoc OpenAPI:** For API documentation with a web MVC UI.
- **ModelMapper:** For object mapping.
- **Bucket4j & Caffeine:** For rate limiting and caching.
- **MySQL Connector:** For database connectivity.
- **Other Utilities:** Including logging (Logstash), specification argument resolver, and more.

### Getting Started with Docker
For a streamlined development experience, you can run the frontend, backend, and MySQL together using Docker Compose. This setup handles container orchestration, network configuration, and environment management in one go.

#### Prerequisites
- Docker: Ensure Docker is installed on your machine.
- Docker Compose: Installed as part of Docker Desktop or separately on Linux.

### Running the Application with Docker Compose
1. **Clone the repository and navigate to the project root:**

   ```shell
   git clone https://github.com/yourusername/chatsync.git
   cd chatsync
   ```

2. **Fill in all the necessary values for the .env.example files.**

3. **Start all services using Docker Compose:**

   ```shell
   docker-compose up --build
   ```

4. **Access the services**
    - **Frontend:** http://localhost:3000
      
    - **Backend API:** http://localhost:8080
      
    - **Swagger:** http://localhost:8080/api/swagger-ui/index.html
      
    - **MySQL:** Accessible on port 3306
