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
    command: ['cat']
    tty: true
"""
    }
  }

  stages {
    stage('Test docker-client') {
      steps {
        container('docker-client') {
          sh 'echo Hello from docker-client container'
        }
      }
    }
  }
}
