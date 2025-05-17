pipeline {
  agent any

  environment {
    CI = "false"
    VERCEL_TOKEN = credentials('vercel-token')
    TEST_FAILURE = "false"
    PROJECT_DIR = "game-project"
  }

  tools {
    nodejs 'Node 20'
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
        dir(env.PROJECT_DIR) {
          bat 'npm install'
          bat 'npm install vercel --save-dev'
        }
      }
    }

    stage('Run Robot.js Unit Test') {
      steps {
        dir(env.PROJECT_DIR) {
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
    }

    stage('Build app') {
      when {
        expression { env.TEST_FAILURE == "false" }
      }
      steps {
        dir(env.PROJECT_DIR) {
          bat 'npm run build'
        }
      }
    }

    stage('Deploy to Vercel') {
      when {
        expression { env.TEST_FAILURE == "false" }
      }
      steps {
        dir(env.PROJECT_DIR) {
          bat 'npx vercel --prod --token %VERCEL_TOKEN% --yes'
        }
      }
    }
  }
}