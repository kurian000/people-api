pipeline {
    agent {
        kubernetes {
            label 'cd-jenkins-agent'
            defaultContainer 'jnlp'
            yaml """
            apiVersion: v1
            kind: Pod
            spec:
              containers:
              - name: jnlp
                image: jenkins/inbound-agent:3309.v27b_9314fd1a_4-5
                args: ['\$(JENKINS_SECRET)', '\$(JENKINS_AGENT_NAME)']
              - name: docker-client
                image: docker:20.10
                command:
                - cat
                tty: true
            """
        }
    }
    environment {
        PROJECT_ID = 'dev-monitoring-456712'
        CLUSTER_NAME = 'autopilot-cluster-1'  // Or 'hello-cluster'
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
                container('docker-client') {
                    sh 'docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .'
                }
            }
        }
        stage('Push to GCR') {
            steps {
                container('docker-client') {
                    withCredentials([file(credentialsId: "${CREDENTIALS_ID}", variable: 'GC_KEY')]) {
                        sh 'cat ${GC_KEY} | docker login -u _json_key --password-stdin https://gcr.io'
                        sh 'docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}'
                    }
                }
            }
        }
        stage('Deploy to GKE') {
            steps {
                sh "gcloud container clusters get-credentials ${CLUSTER_NAME} --region ${LOCATION} --project ${PROJECT_ID}"
                sh "kubectl apply -f deployment.yaml"
            }
        }
    }
}
