# decentralized-event-fairies

- <https://protopedia.net/prototype/3598>

## 動かし方

### フロントエンド

```
npm start frontend
```

### バックエンド

```
docker compose up -d
cd apps/hasura/initialize
for i in *.sh
do
bash $i
done
```

### アプリケーション

<http://localhost:4200/>
