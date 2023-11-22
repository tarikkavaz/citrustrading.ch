#!/bin/bash

# Color code
BLUE='\e[34m'
RESET='\e[0m'

# Function to create a full-width line
full_width_line() {
    local cols=$(tput cols)
    local line=$(printf '%*s' "$cols")
    local blue=$(tput setaf 4)
    local reset=$(tput sgr0)
    echo "${blue}${line// /$1}${reset}"
}

# Load environment variables from .env file
ENV_FILE="frontend/.env"
if [ -f "$ENV_FILE" ]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    printf ".env file not found\n"
    exit 1
fi

# SSH details and server path from environment variables
SSH_ALIAS=$SSH_ALIAS
SERVER_PATH=$SERVER_PATH
IMAGEVOLUMEPREFIX=$IMAGEVOLUMEPREFIX

# Function to run commands on the remote server
run_on_remote() {
    ssh -t "$SSH_ALIAS" "$@" # -t flag forces TTY allocation
}

# Restart Docker on remote
restart_docker() {
    printf "Restarting Docker on remote server\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && git pull && docker-compose -f docker-compose.prod.yml up -d"
    full_width_line '-'
    printf "Docker restarted.\n"
}

# Function to pull from remote
pull_repo() {
    printf "Pulling changes from the repo to remote server\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && git pull"
    full_width_line '-'
    printf "Changes pulled.\n"
}

# Function to add, commit, and push changes to the repository
push_changes() {
    printf "Adding, committing, and pushing changes to the repo from remote server\n"
    full_width_line '-'
    git add .
    git commit -m "pushed from server"
    git push
    full_width_line '-'
    printf "Changes pushed to the repository.\n"
}

# Function to update and rebuild the frontend
update_frontend() {
    printf "Updating Frontend on remote server\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && git pull && docker-compose -f docker-compose.prod.yml up --build -d frontend"
    full_width_line '-'
    printf "Frontend updated.\n"
}

# Function to update and rebuild the backend
update_backend() {
    printf "Updating Backend on remote server\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && git pull && docker-compose -f docker-compose.prod.yml up --build -d backend && docker-compose exec backend python manage.py migrate && docker-compose exec backend python manage.py collectstatic --no-input"
    full_width_line '-'
    printf "Backend updated.\n"
}

# Function to update both frontend and backend
update_all() {
    printf "Updating Frontend and Backend on remote server\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && git pull && docker-compose -f docker-compose.prod.yml up --build -d && docker-compose exec backend python manage.py migrate && docker-compose exec backend python manage.py collectstatic --no-input"
    full_width_line '-'
    printf "Frontend and Backend updated.\n"
}

# Function to dump data
dumpdata() {
    printf "Dumping data on remote server\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && docker-compose exec backend python manage.py dumpdata > backend/datadump.json"
    full_width_line '-'
    printf "Data dumped.\n"
}

# Function to load data dump
loaddata() {
    printf "Loading data dump on remote server\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && docker-compose exec backend python manage.py loaddata /backend/datadump.json"
    full_width_line '-'
    printf "Data dump loaded.\n"
}

# Function to prune Docker system
prune_docker() {
    printf "Pruning Docker system on remote server\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && docker system prune -a -f"
    full_width_line '-'
    printf "Docker system pruned.\n"
}

# Function to create a tar file with all files from the volume images
create_images_tar() {
    printf "Creating tar file from images volume on remote server\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && docker run --rm -v ${IMAGEVOLUMEPREFIX}_images:/images -v $(pwd):/backup ubuntu tar cvf /backup/images.tar /images"
    full_width_line '-'
    printf "Tar file created.\n"
}

# Function to download the tar file to local
download_images_tar() {
    printf "Downloading images tar file to local\n"
    full_width_line '-'
    scp "$SSH_ALIAS:$SERVER_PATH/images.tar" .
    full_width_line '-'
    printf "Tar file downloaded.\n"
}

# Function to extract the tar file to local images volume
extract_images_tar() {
    printf "Extracting images from tar file to local volume\n"
    full_width_line '-'
    tar xvf images.tar -C ./${IMAGEVOLUMEPREFIX}_images
    full_width_line '-'
    printf "Images extracted to local volume.\n"
}


# Check command line argument
case "$1" in
    restart)
        restart_docker
        ;;
    pull)
        pull_repo
        ;;
    push)
        push_changes
        ;;
    frontend)
        update_frontend
        ;;
    backend)
        update_backend
        ;;
    all)
        update_all
        ;;
    loaddata)
        loaddata
        ;;
    dumpdata)
        dumpdata
        ;;
    prune)
        prune_docker
        ;;
    create-tar)
        create_images_tar
        ;;
    download-tar)
        download_images_tar
        ;;
    extract-tar)
        extract_images_tar
        ;;
    *)
        printf "Usage: $0 {restart|pull|push|frontend|backend|all|loaddata|dumpdata|prune|create-tar|download-tar|extract-tar}\n"
        exit 1
esac
