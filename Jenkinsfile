pipeline {
  agent any
  environment {
    PROJECT_ID = 'dev-monitoring-456712'
    CLUSTER_NAME = 'autopilot-cluster-1'
    LOCATION = 'us-central1'
    CREDENTIALS_ID = 'gke-credentials'
    DOCKER_IMAGE = "gcr.io/${PROJECT_ID}/people-api"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build Docker Image') {
      steps {
        script {
          docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
        }
      }
    }
    stage('Push to GCR') {
      steps {
        script {
          docker.withRegistry("https://gcr.io", "gcr:${CREDENTIALS_ID}") {
            docker.image("${DOCKER_IMAGE}:${env.BUILD_ID}").push()
            docker.image("${DOCKER_IMAGE}:${env.BUILD_ID}").push('latest')
          }
        }
      }
    }
    stage('Deploy to GKE') {
      steps {
        sh "sed -i 's|PROJECT_ID|${PROJECT_ID}|g' deployment.yaml"
        sh "gcloud container clusters get-credentials ${CLUSTER_NAME} --zone ${LOCATION} --project ${PROJECT_ID}"
        sh "kubectl apply -f deployment.yaml"
      }
    }
  }
}
