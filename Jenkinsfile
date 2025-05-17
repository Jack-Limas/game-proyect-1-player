pipeline {
  agent any

  environment {
    CI = "false" // Evita que React trate los warnings como errores
    VERCEL_TOKEN = credentials('vercel-token')
    // Añadido: Variable para manejar fallos en tests
    TEST_FAILURE = "false" 
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
        git url: 'https://github.com/Jack-Limas/game-proyect-1-player.git', branch: 'main'
      }
    }

    stage('Install dependencies') {
      steps { 
        bat 'npm install three cannon-es --save-dev' // Añadido: Instalación explícita
        bat 'npm install --legacy-peer-deps' 
      }
    }

    stage('Run Robot.js Unit Test') {
      steps { 
        script {
          try {
            bat 'npx vitest run src/__tests__/Robot.test.js'
          } catch (err) {
            echo "Tests fallaron pero continuamos: ${err}"
            env.TEST_FAILURE = "true"
          }
        }
      }
    }

    stage('Build app') {
      when {
        expression { env.TEST_FAILURE == "false" }
      }
      steps { bat 'npm run build' }
    }

    // Añadido: Nueva etapa para despliegue en Vercel
    stage('Deploy to Vercel') {
      when {
        expression { env.TEST_FAILURE == "false" }
      }
      steps {
        bat 'npx vercel --prod --token %VERCEL_TOKEN%'
      }
    }
  }
}