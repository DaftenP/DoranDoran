#!/bin/bash

echo "#############################################"
echo "########## DoranDoran Setup Script ##########"
echo "#############################################"

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

cd ../../
PWD=$(pwd)

echo "Do you want to resume from a specific step? (Y/n)"
read -r resume
if [ -z "$resume" ] || [[ "$resume" =~ ^[Yy]$ ]]; then
  echo "Enter the step number to resume from:"
  echo "1. Install k3s"
  echo "2. Install Kafka and Zookeeper"
  echo "3. Build the backend image by Dockerfile and deploy reference to the image"
  echo "4. Build the frontend image by Dockerfile and deploy reference to the image"
  read -r step
  if ! [[ "$step" =~ ^[1-4]+$ ]]; then
    echo "Please enter a valid step number"
    exit 1
  fi
else
  step=1
fi

if [ "$step" -le 1 ]; then
  echo "#############################################"
  echo "#########           Step 1          #########"
  echo "#############################################"
  echo "Install K3S"
  if ! command -v k3s &> /dev/null; then
    curl -sfL https://get.k3s.io | sh -
    systemctl enable k3s
  fi

  echo "Step 1: Done"
fi

if [ "$step" -le 2 ]; then
  echo "#############################################"
  echo "#########           Step 2          #########"
  echo "#############################################"
  echo "Install Kafka and Zookeeper"

  kubectl apply -f $PWD/S11P12E204/infra/kafka-deployment.yaml
  kubectl wait --namespace=event-queue --for=condition=ready pod --selector=app=kafka --timeout=120s

  echo "Step 2: Done"
fi

if [ "$step" -le 3 ]; then
  echo "#############################################"
  echo "#########           Step 3          #########"
  echo "#############################################"
  echo "Build the backend image by Dockerfile and deploy reference to the image"

  cd $PWD/S11P12E204/server

  # get directory names in the current directory
  for dir in */; do
    cd $dir
    if [ -f "Dockerfile" ]; then
      docker build -t ssafy-tailored-$dir .
      
      # if db.yaml exists, deploy the backend service
      if [ -f "k8s/db.yaml" ]; then
        kubectl apply -f k8s/db.yaml

        kubectl wait --namespace=ns-$dir --for=condition=ready pod --selector=app=$dir --timeout=120s
      fi

      if [ -f "k8s/deployment.yaml" ]; then
        kubectl apply -f k8s/deployment.yaml

        kubectl wait --namespace=ns-$dir --for=condition=ready pod --selector=app=$dir --timeout=120s
      fi

      if [ -f "k8s/hpa.yaml" ]; then
        kubectl apply -f k8s/hpa.yaml
      fi
    fi
    cd ../
  done

  cd ../../

  echo "Step 3: Done"
fi

if [ "$step" -le 4 ]; then
  echo "#############################################"
  echo "#########           Step 4          #########"
  echo "#############################################"
  echo "Build the frontend image by Dockerfile and deploy reference to the image"

  cd $PWD/S11P12E204/client

  docker build -t ssafy-tailored-client .

  kubectl apply -f k8s/deployment.yaml

  kubectl wait --namespace=ns-client --for=condition=ready pod --selector=app=client --timeout=120s

  kubectl apply -f k8s/hpa.yaml

  cd ../../

  echo "Step 4: Done"
fi

echo "#############################################"
echo "#########  DoranDoran Setup Script  #########"
echo "#########          Finished         #########"
echo "#############################################"