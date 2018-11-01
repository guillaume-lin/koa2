#Dockerfile
FROM node:8.12.0                  
#COPY . /node-project 
VOLUME ["/node-project"]
WORKDIR /node-project              
RUN npm install pm2 -g            
RUN npm install                  
EXPOSE 8000                      
CMD ["pm2-runtime", "./app.js"] 