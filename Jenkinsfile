pipeline {
  agent any

  environment {
    CI = "false"
    VERCEL_TOKEN = credentials('vercel-token')
    TEST_FAILURE = "false"
    PROJECT_DIR = "game-project"
    NPM_CONFIG_ENGINE_STRICT = "true"
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

    stage('Setup .npmrc') {
      steps {
        dir(env.PROJECT_DIR) {
          writeFile file: '.npmrc', text: '''
            engine-strict=true
            strict-peer-dependencies=true
            fund=false
            audit=false
          '''
        }
      }
    }

    stage('Install dependencies') {
      steps {
        dir(env.PROJECT_DIR) {
          // Paso 1: Limpieza e instalación inicial
          bat 'npm install --package-lock-only'
          
          // Paso 2: Forzar resoluciones seguras
          bat 'npx npm-force-resolutions'
          
          // Paso 3: Instalación completa
          bat 'npm install'
          
          // Paso 4: Actualización segura de Vercel
          bat 'npm install vercel@latest --save-dev --engine-strict'
          
          // Paso 5: Verificación
          bat 'npm ls path-to-regexp semver || echo "Continuing despite version checks"'
        }
      }
    }

    stage('Security Audit') {
      steps {
        dir(env.PROJECT_DIR) {
          script {
            try {
              bat 'npm audit --omit=dev --audit-level=high'
            } catch (e) {
              echo "WARNING: Vulnerabilidades de alto nivel detectadas - ${e.message}"
              currentBuild.result = 'UNSTABLE'
            }
          }
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

  post {
    always {
      script {
        if(currentBuild.result == 'UNSTABLE') {
          emailext body: """
            Build ${currentBuild.fullDisplayName} tiene:
            - Vulnerabilidades de dependencias
            - Ver detalles: ${env.BUILD_URL}
            - Revisar package.json y resolutions
          """,
          subject: "ADVERTENCIA: Vulnerabilidades en ${env.JOB_NAME}",
          to: 'tu-email@dominio.com'
        }
      }
    }
  }
}