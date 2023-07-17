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

        // stage('Fortify scan - ASG'){
        //     agent {
        //         label 'fortify_agent'
        //     }
        //     when { changeRequest() }
        //     steps {
        //         sh 'mvn -ntp -DskipTests com.fortify.sca.plugins.maven:sca-maven-plugin:clean com.fortify.sca.' +
        //                 'plugins.maven:sca-maven-plugin:translate com.fortify.sca.plugins.maven:sca-maven-plugin:scan'
        //     }

        //     {
        //         sh '/home/ci/FortifyASG.sh 334026729'
        //     }
        // }

        stage('Sonarqube Analysis') {
            steps {
                script {
                    withSonarQubeEnv(installationName: 'Central Sonar') {
                        sh 'mvn install org.sonarsource.scanner.maven:sonar-maven-plugin:3.9.1.2184:sonar -ntp -Pdhl-artifactory'
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Deploy artifacts to Artifactory') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    branch pattern: "release/\\d+", comparator: "REGEXP"
                    }
                }
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
                            goals: '-ntp clean install -Pdhl-artifactory',
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
