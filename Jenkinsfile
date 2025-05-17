pipeline {
  agent any

  environment {
    CI = "false" // Evita que React trate los warnings como errores
    VERCEL_TOKEN = credentials('vercel-token')
  }

  tools {
    nodejs 'Node 20' // Instalación limpia de NodeJS
  }

  stages {
    stage('Clean workspace') {
      steps { deleteDir() }
    }

    stage('Checkout') {
      steps {
        git url: 'https://github.com/su-usuario/surepositorio.git', branch: 'main'
      }
    }

    stage('Install dependencies') {
      steps { bat 'npm install --legacy-peer-deps' }
    }

    stage('Run Robot.js Unit Test') {
      steps { bat 'npx vitest run src/Experience/World/__tests__/Robot.test.js' }
    }

    stage('Build app') {
      steps { bat 'npm run build' }
    }
  }
}