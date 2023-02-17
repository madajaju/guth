
module.exports = {
    name: '_bpm',
    contexts: {
        dev: {
            type: 'swarm',
            tag: '_bpm_dev',
            file: 'docker-compose.yml',
            env: {}
        },
        test: {
            type: 'swarm',
            tag: '_bpm_test',
            file: 'docker-compose.yml',
            env: {}
        },
        prod: {
            type: 'swarm',
            tag: '_bpm_prod',
            file: 'docker-compose.yml',
            env: {}
        }
    }
}
