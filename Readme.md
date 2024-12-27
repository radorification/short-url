# URL Shortener Service

A full-featured URL shortener application with analytics and user authentication. This service allows users to shorten URLs, track analytics, and categorize URLs into topics.

---

## Features

- Shorten long URLs with optional custom aliases.
- Track analytics such as total clicks, unique clicks, device types, and OS types.
- Google Sign-In for user authentication.
- Retrieve analytics for individual URLs, topics, and overall user performance.
- Dockerized for easy deployment.
- Caching with Redis to improve performance.

---

## Getting Started

### Prerequisites
- Docker installed on your machine.
- A browser or Postman for API testing.

---

### 1. Access the Docker Image

If you have the Dockerized image of the app hosted on a registry (e.g., Docker Hub), you can pull it using:

```bash
docker pull radorification/short-url:latest
``` 
If you're using the source code, clone the repository:

```bash
git clone https://github.com/radorification/short-url.git
cd short-url
``` 
### 2. Run the App with Docker Compose

1. Build and Run the App: Ensure docker-compose.yml is configured correctly with environment variables. Then run:

```bash
docker-compose up --build
```


2. Environment Variables: If using a .env file, include:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
REDIS_HOST=redis
REDIS_PORT=6379
BASE_URL=http://localhost:5050
```

3. Access the App:

The app will be available at http://localhost:5050.

---

### 3. Test the App in Postman
1. Authentication

* Login with Google:
    - Endpoint: GET `/auth/google`

    - This will redirect you to the Google Sign-In page.

2. Shorten a URL

- Endpoint: POST `/api/shorten`
- Body:
```bash
{
    "longUrl": "https://example.com",
    "customAlias": "exampleAlias",
    "topic": "activation"
}
```
- Response:

```bash
{
    "shortUrl": "http://localhost:5050/exampleAlias",
    "createdAt": "2024-12-27T12:00:00.000Z"
}
```

3. Access analysis:

* Individual URL Analytics::
    - Endpoint: GET `/api/analytics/:alias`
    - Example: `/api/analytics/exampleAlias`
    - Response includes *total clicks*, *unique clicks*, and *click breakdown by OS* and *device type*.

* Overall User Analytics::
    - Endpoint: GET `/api/analytics/overall`
    - Requires authentication with a valid cookie.

---

### 4. Using Cookies for Authentication
* What Are Cookies?

    Cookies are used to store session information after logging in with Google. The app uses the `connect.sid` cookie to authenticate users for analytics endpoints.

* Where to Find Cookies?
    - Open your browser's *Developer Tools*.
    - Go to the *Application* tab.
    - Find the `Cookies` section under *Storage*.
    - Locate the cookie `connect.sid` for the domain `http://localhost:5050`.

* How to Use Cookies in Postman?

    1. Copy the value of the `connect.sid` cookie.
    2. In Postman, go to the Headers tab of your request.
    3. Add a key-value pair:
        -  Key: `Cookie`
        - Value: `connect.sid=<cookie-value>`

Example:
```bash
Cookie: connect.sid=s%3A_wKIQk_EE-gTvAxQ4g38n4GTB2Ks9-Oc.uNZVjdp6m1Am9fv9CCpQJhi43hvw2jJfzC7ZOu6iKM8
```
---

### 5. API Endpoints

* Authentication

    - GET `/auth/google` - Redirect to Google Sign-In.
    - GET `/auth/google/callback` - Callback endpoint for Google Sign-In.
* Shorten URL
    - POST `/api/shorten` - Create a new short URL.

* Redirection
    - GET `/<alias>` - Redirect to the original URL.

* Analytics
    - GET `/api/analytics/<alias>` - Fetch analytics for a specific URL.
    - GET `/api/analytics/overall` - Fetch overall user analytics.
    - GET `/api/analytics/topic/<topic>` - Fetch analytics for a particular topic.

---

### 6. Testing Workflow

1. Log in using `GET /auth/google`.
2. *Retrieve the Cookie* `(connect.sid)` from the browser.
3. Use the cookie in Postman for analytics requests:
    - Add the cookie in the Headers tab as:
    ```bash
    Cookie: connect.sid=<cookie-value>
    ```
4. Test individual or overall analytics endpoints.
---