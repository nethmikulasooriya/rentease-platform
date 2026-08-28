pipeline {
    agent any
    
    environment {
        SONAR_HOST = 'http://localhost:9000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/yourrepo/rentease.git'
            }
        }
        
        stage('Build Services') {
            steps {
                parallel(
                    'User': {
                        dir('user-service') { bat 'mvn clean package -DskipTests' }
                    },
                    'Catalog': {
                        dir('catalog-service') { bat 'mvn clean package -DskipTests' }
                    },
                    'Booking': {
                        dir('booking-service') { bat 'mvn clean package -DskipTests' }
                    },
                    'Payment': {
                        dir('payment-service') { bat 'mvn clean package -DskipTests' }
                    },
                    'Notification': {
                        dir('notification-service') { bat 'mvn clean package -DskipTests' }
                    }
                )
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                parallel(
                    'User': {
                        dir('user-service') { bat 'mvn sonar:sonar -Dsonar.projectKey=rentease-user' }
                    },
                    'Catalog': {
                        dir('catalog-service') { bat 'mvn sonar:sonar -Dsonar.projectKey=rentease-catalog' }
                    },
                    'Booking': {
                        dir('booking-service') { bat 'mvn sonar:sonar -Dsonar.projectKey=rentease-booking' }
                    },
                    'Payment': {
                        dir('payment-service') { bat 'mvn sonar:sonar -Dsonar.projectKey=rentease-payment' }
                    },
                    'Notification': {
                        dir('notification-service') { bat 'mvn sonar:sonar -Dsonar.projectKey=rentease-notification' }
                    }
                )
            }
        }
        
        stage('Docker Build') {
            steps {
                bat 'docker compose build'
            }
        }
        
        stage('Deploy') {
            steps {
                bat 'docker compose up -d --build'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
