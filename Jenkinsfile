pipeline {
    agent {
        node {
            label 'openshift4-prg-heavy'
        }
    }

    tools {
        maven 'Maven 3.6.3'
        jdk 'JDK11'
    }

    options {
        disableConcurrentBuilds()
        timestamps()
        ansiColor('xterm')
    }
    stages {
        stage('SCM Checkout'){
            steps{
                checkout scm
            }

        }

        stage('Sonarqube Analysis') {
           steps {
               script {
                   withSonarQubeEnv(installationName: 'Central Sonar') {
                       sh 'mvn install org.sonarsource.scanner.maven:sonar-maven-plugin:3.7.0.1746:sonar -Pcoverage'
                   }
               }
            }
        }

        stage('Build & Deploy artifacts to Artifactory') {

            steps {
                withCredentials([usernamePassword(credentialsId: 'srv_jenkins_creds', passwordVariable:
                        'artifactory_pwd', usernameVariable: 'artifactory_user')]){
                    rtServer (
                            id: 'server',
                            url: 'https://artifactory.dhl.com',
                            bypassProxy: true,
                            timeout: 300,
                            username: artifactory_user,
                            password: artifactory_pwd
                    )

                    rtMavenResolver(
                            id: 'artifactory-resolver',
                            serverId: 'server',
                            releaseRepo: 'maven-release',
                            snapshotRepo: 'maven-snapshot'
                    )

                    rtMavenDeployer(
                            id: 'artifactory-deployer',
                            serverId: 'server',
                            releaseRepo: 'maven-dhl-release-local',
                            snapshotRepo: 'maven-dhl-snapshot-local'
                    )

                    rtMavenRun (
                            tool: 'Maven 3.6.3',
                            useWrapper: false,
                            pom: 'pom.xml',
                            goals: '-ntp clean install',

                            resolverId: 'artifactory-resolver',
                            deployerId: 'artifactory-deployer',
                    )

                    rtPublishBuildInfo(
                            'serverId': 'server'
                    )
                }
            }
        }
    }
}
