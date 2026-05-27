# Instalar dependencias
install:
	rm -rf node_modules .angular package-lock.json
	npm install --legacy-peer-deps

# Compilar app
build:
	rm -rf dist
	npm run build -- --configuration production

# Deploy S3
deploy:
	rm -rf dist
	npm run build -- --configuration production
	aws s3 sync dist/herbanatura/browser/ s3://herbanatura-frontend --delete

crear component atom angular:
	ng generate component presentation/shared/components/atoms

crear component molecule angular:
	ng generate component presentation/shared/components/molecules

crear component organism angular:
	ng generate component presentation/shared/components/organisms

crear component template angular:
	ng generate component presentation/shared/components/templates