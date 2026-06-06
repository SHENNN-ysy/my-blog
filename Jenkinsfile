pipeline {
    agent any

    parameters {
        string name: 'BRANCH', defaultValue: 'main', description: 'Git branch to build'
        booleanParam name: 'DEPLOY', defaultValue: false, description: 'Deploy after build?'
    }

    environment {
        PROJECT_DIR = '/data/my-blog'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.BRANCH_NAME ?: params.BRANCH}"
                sh 'git log --oneline -5'
            }
        }

        stage('Build Backend') {
            steps {
                dir('my_blog_demo') {
                    sh 'mvn clean compile -B'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install && npm run build'
                }
            }
        }

        stage('Build Backstage') {
            steps {
                dir('backstage') {
                    sh 'npm install && npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Deploy') {
            when {
                expression { params.DEPLOY == true }
            }
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
                echo 'Deploy done'
            }
        }

        stage('Health Check') {
            when {
                expression { params.DEPLOY == true }
            }
            steps {
                sh 'sleep 15'
                sh 'curl -sf http://localhost:8080/actuator/health || exit 1'
                echo 'Backend is healthy'
            }
        }
    }

    post {
        success {
            echo 'CI pipeline succeeded'
        }
        failure {
            echo 'CI pipeline failed, check logs'
        }
    }
}
