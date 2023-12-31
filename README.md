# Full-Stack Web Development with Django, Next.js, and Docker

This Guide provides a comprehensive set of instructions for setting up, developing, and deploying a web application using a combination of technologies including Docker, Django, and Next.js. This guide is tailored for deployment on a DigitalOcean Droplet, ensuring a smooth transition from local development to a live production environment. It covers initial setup, development configurations.

---

<img src="1.png" alt="image" height="100px" width="1px"/>

## Index

- [Initial Setup](#initial-setup)
- [Development Setup](#development-setup)
- [Production Setup on any Ubuntu Server](#production-setup-on-any-ubuntu-server)
- [Production Setup on Digitalocean Droplet](#production-setup-on-digitalocean-droplet)
- [Deploy Script Commands](#deploy-script-commands)
- [Bonus - Install OhMyZsh](#bonus---install-ohmyzsh)

---

<img src="1.png" alt="image" height="100px" width="1px"/>

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

<img src="1.png" alt="image" height="100px" width="1px"/>

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

<img src="1.png" alt="image" height="100px" width="1px"/>

## Production Setup on any Ubuntu Server

Ensure you have a clean installation of Ubuntu Server without Nginx, Docker Compose, or other related software pre-installed.

### Steps

Connect to the server via SSH and run the following commands:

1. **Install Docker Engine**
    ```bash
    sudo apt update
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt update
    sudo apt install docker-ce
    ```

2. **Manage Docker as a Non-root User**
    ```bash
    sudo groupadd docker
    sudo usermod -aG docker $USER
    newgrp docker 
    ```

3. **Install Docker Compose**
    ```bash
    sudo apt install docker-compose
    ```

4. **Install nvm and Set Node Version to 18.12.0**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.zshrc
    source ~/.zshrc
    nvm install 18.12.0
    ```

5. **Install Yarn**
    ```bash
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt update
    sudo apt install yarn
    ```

6. **Install Git**
    ```bash
    sudo apt install git
    ```

7. **Configure Firewalll** (Optional)
    Configure the firewall to allow traffic on necessary ports (80, 443, 8000, 3000):

    ```bash
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw allow 8000
    sudo ufw allow 3000
    ```

8. **SSL Certificates Setup** (Optional)

    If using HTTPS, set up your SSL certificates and reference them in your Nginx configuration.

9. **Running the Application**
    Navigate to your project directory and start your Docker containers:

    ```bash
    docker-compose -f docker-compose.prod.yml up
    ```



**Notes**

- Adjust commands as necessary for your specific Ubuntu version and server configuration.
- Always refer to the official Docker documentation for the most up-to-date installation procedures.


---

<img src="1.png" alt="image" height="100px" width="1px"/>

## Production Setup on Digitalocean Droplet

### Prerequisites

- Docker Droplet installed from Digitalocean Marketplace (Ubuntu 20.04)
    - Select a minimum Plan of __2 GB / 1 CPU 50 GB SSD Disk 2 TB transfer__
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

### Media File backup and restore

**On local**

```bash
docker run --rm -v citrustradingch_media:/data -v $(pwd):/backup ubuntu bash -c 'cd /data && tar cvf /backup/images.tar *' &&
scp images.tar citrustrading:/var/lib/docker/volumes/citrustradingch_media/_data/images
```

**On Server**

```bash
tar -xvf images.tar -C /var/lib/docker/volumes/citrustradingch_media/_data/images
```

---

<img src="1.png" alt="image" height="100px" width="1px"/>

## Deploy Script Commands

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

To **Restart Docker** on server, use the following command:

```bash
./deploy.sh restart
```

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

---

<img src="1.png" alt="image" height="100px" width="1px"/>

## Bonus - Install OhMyZsh

Install zsh

```
sudo apt install zsh -y
```

Set zsh as default

```
chsh -s $(which zsh)
```

Install Oh my Zsh

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Install p10k

```
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc
```

Source zshrc

```
source .zshrc
```

If not autoloaded, setup p10k

```
p10k configure
```

hushlogin

```
touch ~/.hushlogin
```
