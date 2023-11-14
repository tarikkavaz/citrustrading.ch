# Full-Stack Web Development with Django, Next.js, and Docker

This Guide provides a comprehensive set of instructions for setting up, developing, and deploying a web application using a combination of technologies including Docker, Django, and Next.js. This guide is tailored for deployment on a DigitalOcean Droplet, ensuring a smooth transition from local development to a live production environment. It covers initial setup, development configurations,

---

## Initial Setup

### Prerequisites

- Docker and Docker Compose: [Installation Guide](https://docs.docker.com/get-docker/)
- Git: [Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Steps

1. **Clone the Repository**
    ```bash
    git clone https://github.com/tarikkavaz/citrustrading.ch.git
    cd citrustrading.ch
    ```

2. **Setup Frontend Environment Variables**
    ```bash
    cp frontend/.env-sample-local frontend/.env
    ```

3. **Install Frontend Dependencies and Build**
    ```bash
    (cd frontend && yarn)
    (cd frontend && yarn build)
    ```

4. **Build and Run Docker Containers**
    ```bash
    docker-compose up --build -d
    ```

5. **Initialize Django Database**
    ```bash
    docker-compose exec backend python manage.py migrate
    ```

6. **Load Sample Data (Optional)**
    ```bash
    docker-compose exec backend python manage.py loaddata datadump.json
    ```

7. **Create Django Superuser**
    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```

8. **Stop the Docker**
    ```bash
    docker-compose down
    ```
---

## Development Setup

### Steps

1. **Build and Run Docker Containers**
    ```bash
    docker-compose up --build
    ```

2. **Access the Application**

    - Open [http://0.0.0.0:3000](http://0.0.0.0:3000) for the site. 
    - Open [http://0.0.0.0:8000/api](http://0.0.0.0:8000/api) for the API. 
    - Open [http://0.0.0.0:8000/admin](http://0.0.0.0:8000/admin) for the Django Admin Panel. 

---

## Productoion Setup on Digitalocean Droplet

### Prerequisites

- Docker Droplet installed from Digitalocean Marketplace (Ubuntu 20.04)
    Select a minimum Plan of __2 GB / 1 CPU 50 GB SSD Disk 2 TB transfer__
- Domain name pointing to the server

### Steps

Connect to the server via SSH and run the following commands:

1. **Install Docker Compose**
    ```bash
    apt install docker-compose
    ```

2. **Install nvm and set Node version to 18.12.0**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash &&
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc &&
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc &&
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.zshrc &&
    source ~/.zshrc &&
    nvm install 18.12.0
    ```

3. **Install Yarn**
    ```bash
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - &&
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list &&
    sudo apt update &&
    sudo apt install yarn
    ```

4. **Clone the Repository**
    ```bash
    git clone https://github.com/tarikkavaz/citrustrading.ch.git citrustrading.ch
    cd citrustrading.ch
    ```

5. **Setup Frontend Environment Variables**
    ```bash
    cp frontend/.env-sample-server frontend/.env
    ```
    Ensure that the values are correctly set.

6. **Setup Nginx file**
    ```bash
    cp nginx.conf-sample nginx.conf
    ```
    Ensure that the values `YOURDOMAINNAME` are correctly set.

7. **Run the Docker**
   
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d &&
    docker-compose exec backend python manage.py migrate &&
    docker-compose exec backend python manage.py loaddata datadump.json &&
    docker-compose exec backend python manage.py collectstatic &&
    docker-compose exec backend python manage.py createsuperuser
    ```
    ( u:`admin` p:`boilerplate123` ) 
---

## Deploy from Local Machine to Digitalocean Droplet

### Setup for Deploy Script

Before using the deploy script, set up your `frontend/.env` file and SSH configurations:

**Edit `.env` File:**
Make sure your `frontend/.env` file has these lines:
```properties
SERVER_PATH=/root/yourdomainname.com
SSH_ALIAS=yoursshalias
IMAGEVOLUMEPREFIX=yourprojectname
```
Replace `yourdomainname.com`, `yoursshalias`, and `yourprojectname` with your actual server path, SSH alias, and project name.

**Find Your Image Volume Name:**
If unsure about `IMAGEVOLUMEPREFIX`, run `docker volume ls` in the terminal.
Use the name before `_images` from the volume list.


Ensure that your script is executable by running the following command:
```bash
chmod +x deploy.sh
```

### Application Deployment and Maintenance Commands

To **Pull Changes** perform a git pull on the server, use the following command:

```bash
./deploy.sh pull
```

To **update the frontend** of your application, use the following command:

```bash
./deploy.sh frontend
```

To **update the backend**, use this command:

```bash
./deploy.sh backend
```

If you need to **update both frontend and backend**, use:

```bash
./deploy.sh all
```

To **prune** unused Docker objects, you can use:

```bash
./deploy.sh prune
```

### Data Management

For data management tasks, the script supports the following commands:

To **dump data**:
```bash
./deploy.sh dumpdata
```

To **load data** (e.g., from a dump):
```bash
./deploy.sh loaddata
```

### Image Volume Management

To manage images stored in a Docker volume, use the following commands. 

To **create a tar file** of all files from the `images` volume on the remote server:
```bash
./deploy.sh create-tar
```

To **download the tar file** to the local root of the project:
```bash
./deploy.sh download-tar 
```

To **extract files from the tar file** to the `local` images volume:
```bash
./deploy.sh extract-tar
```
