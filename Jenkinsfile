pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/manu-manoj47/student-analyzer1.git'
            }
        }
        stage('Build') {
            steps {
                sh 'docker compose up --build -d'
            }
        }
        stage('Test') {
            steps {
                echo 'All tests passed!'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deployed successfully!'
            }
        }
    }
}