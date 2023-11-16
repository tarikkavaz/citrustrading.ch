
On Server

```bash
cd ~
cd citrustrading.ch &&
docker stop $(docker ps -aq) &&
docker rm $(docker ps -aq) &&
docker rmi $(docker images -q) &&
docker volume rm $(docker volume ls -q) &&
docker network prune -f &&
cd .. &&
rm -rf citrustrading.ch &&
git clone https://github.com/tarikkavaz/citrustrading.ch.git &&
cd citrustrading.ch &&
cp frontend/.env-sample-server frontend/.env &&
cp nginx.conf-sample nginx.conf &&
docker-compose -f docker-compose.prod.yml up --build -d &&
docker-compose exec backend python manage.py migrate &&
docker-compose exec backend python manage.py collectstatic && 
docker-compose exec backend python manage.py loaddata /backend/datadump.json &&
docker-compose exec backend python manage.py createsuperuser
```

auth

```bash
admin
boilerplate123
```

On local

```bash
docker run --rm -v citrustradingch_media:/data -v $(pwd):/backup ubuntu bash -c 'cd /data && tar cvf /backup/images.tar *' &&
scp images.tar citrustrading:/var/lib/docker/volumes/citrustradingch_media/_data/images
```

On Server

```bash
tar -xvf images.tar -C /var/lib/docker/volumes/citrustradingch_media/_data/images
```