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

# Function to run commands on the remote server
run_on_remote() {
    ssh -t "$SSH_ALIAS" "$@" # -t flag forces TTY allocation
}

# Function to update and rebuild the frontend
update_frontend() {
    printf "Updating Frontend on remote...\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && git pull && docker-compose -f docker-compose.prod.yml up --build -d frontend"
    full_width_line '-'
    printf "Frontend updated.\n"
}

# Function to update and rebuild the backend
update_backend() {
    printf "Updating Backend on remote...\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && git pull && docker-compose -f docker-compose.prod.yml up --build -d backend && docker-compose exec backend python manage.py migrate && docker-compose exec backend python manage.py collectstatic --no-input"
    full_width_line '-'
    printf "Backend updated.\n"
}

# Function to update both frontend and backend
update_all() {
    printf "Updating Frontend and Backend on remote...\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && git pull && docker-compose -f docker-compose.prod.yml up --build -d && docker-compose exec backend python manage.py migrate && docker-compose exec backend python manage.py collectstatic --no-input"
    full_width_line '-'
    printf "Frontend and Backend updated.\n"
}

# Function to dump data
dumpdata() {
    printf "Dumping data on remote...\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && docker-compose exec backend python manage.py dumpdata > backend/datadump.json"
    full_width_line '-'
    printf "Data dumped.\n"
}

# Function to load data dump
loaddata() {
    printf "Loading data dump on remote...\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && docker-compose exec backend python manage.py loaddata /backend/datadump.json"
    full_width_line '-'
    printf "Data dump loaded.\n"
}

# Function to prune Docker system
prune_docker() {
    printf "Pruning Docker system on remote...\n"
    full_width_line '-'
    run_on_remote "cd $SERVER_PATH && docker system prune -a -f"
    full_width_line '-'
    printf "Docker system pruned.\n"
}

# Check command line argument
case "$1" in
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
    *)
        printf "Usage: $0 {frontend|backend|all|loaddata|dumpdata|prune}\n"
        exit 1
esac
