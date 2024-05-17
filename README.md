# adi-intern-test-db

A repository to test connection to cloud SQL DB without exposing them to public IP. Designed to help you to just run the code in your environment


## how to run
### development in local
1. make sure to install node js. I'm using version in file `.nvmrc`
2. make sure to install all dependencies.
```bash
npm install
```
3. for safer developer experience. please install gcloud cli https://cloud.google.com/sdk/docs/install
4. copy `.env.example` to `.env`
```bash
cp .env.example .env
```
5. make sure to copy your **service account json** file in `credentials` folder 
6. setup the environment variable in `.env`. see guide in that file for reference
7. everything ready! just run
```bash
chmod +x cloud_sql_proxy
chmod +x deploy_to_local.sh
./deploy_to_local.sh
```

### build using cloud build and deploy to cloud run
1. make sure to practice the development in local guide first
2. if you are sure, change your `ENV` variable to `PROD`
3. run this
```bash
chmod +x deploy_to_cloud_run.sh
./deploy_to_cloud_run.sh
```
4. if that command fails. check whether you have access to cloud run and cloud build (i assume you have)
