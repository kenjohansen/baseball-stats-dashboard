Installation
============

This guide will help you set up the Baseball Stats Dashboard API on your local machine for development and testing.

Prerequisites
------------

Before you begin, ensure you have the following installed:

* Python 3.10+
* MongoDB 5.0+
* Docker (optional, for containerized deployment)

Environment Setup
----------------

1. Clone the repository:

   .. code-block:: bash

      git clone https://github.com/kenjohansen/baseball-stats-dashboard.git
      cd baseball-stats-dashboard/backend

2. Create and activate a virtual environment:

   .. code-block:: bash

      python -m venv venv
      # On Windows
      venv\Scripts\activate
      # On macOS/Linux
      source venv/bin/activate

3. Install dependencies:

   .. code-block:: bash

      pip install -r requirements.txt

Configuration
------------

1. Create a ``.env`` file based on the provided example:

   .. code-block:: bash

      cp .env.example .env

2. Update the environment variables in the ``.env`` file:

   .. code-block:: ini

      # MongoDB Connection
      MONGO_URI=mongodb://localhost:27017
      DATABASE_NAME=Baseball
      COLLECTION_NAME=Players

      # OpenAI API
      OPENAI_API_KEY=your_openai_api_key

      # Server Configuration
      HOST=0.0.0.0
      PORT=8000
      DEBUG=True

Database Setup
-------------

1. Start MongoDB:

   .. code-block:: bash

      # Using the system service
      sudo systemctl start mongodb

      # Or using Docker
      docker run -d -p 27017:27017 --name mongodb mongo:5.0

2. The application will automatically create the necessary collections on startup.

Running the API
--------------

1. Start the FastAPI server:

   .. code-block:: bash

      uvicorn app.main:app --reload

2. The API will be available at http://localhost:8000

3. Access the API documentation at http://localhost:8000/docs

Docker Deployment
----------------

1. Build the Docker image:

   .. code-block:: bash

      docker build -t baseball-stats-backend .

2. Run the container:

   .. code-block:: bash

      docker run -d -p 8000:8000 --env-file .env --name baseball-api baseball-stats-backend

Kubernetes Deployment
--------------------

For Kubernetes deployment, refer to the :doc:`deployment` section.
