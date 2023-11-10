# Local Setup
```bash
git clone https://github.com/tarikkavaz/TheBoilerplate.git &&
cd TheBoilerplate &&
cp frontend/.env-sample frontend/.env &&
(cd frontend && yarn) &&
(cd frontend && yarn build) &&
docker-compose up --build -d &&
docker-compose exec backend python manage.py migrate &&
docker-compose exec backend python manage.py loaddata datadump.json &&
docker-compose down
```

# Local Development Server
```bash
docker-compose up --build
```
Stop the Development Server with Control-C.

Create data dump with auth.permission:
```bash
docker-compose exec backend python manage.py dumpdata >  backend/datadump.json
```
Create data dump without auth.permission:
```bash
docker-compose exec backend python manage.py dumpdata --exclude auth.permission >  backend/datadump.json
```

# Server Build

Go to the folder where the docker-compose.prod.yml file is located and run the following command:

```bash
cd citrustrading.ch &&
docker-compose down --remove-orphans &&
git pull &&
docker system prune -a -f &&
docker-compose -f docker-compose.prod.yml up --build -d &&
docker-compose exec backend python manage.py migrate &&
docker-compose exec backend python manage.py loaddata /backend/datadump.json &&
docker-compose exec backend python manage.py collectstatic --no-input
```

```bash
cd citrustrading.ch &&
docker-compose down --remove-orphans &&
docker system prune -a -f &&
docker-compose -f docker-compose.prod.yml up --build -d &&
docker-compose exec backend python manage.py migrate &&
docker-compose exec backend python manage.py loaddata /backend/datadump.json &&
docker-compose exec backend python manage.py collectstatic --no-input
```

```bash
docker-compose down &&
docker-compose -f docker-compose.prod.yml up -d
```


docker-compose logs -f
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


```bash
apt install docker-compose
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
nvm install 18.12.0
```