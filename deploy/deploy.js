
module.exports = {
    name: 'guth',
    contexts: {
        dev: {
            type: 'swarm',
            tag: 'guth_dev',
            file: 'docker-compose.yml',
            env: {}
        },
        test: {
            type: 'swarm',
            tag: 'guth_test',
            file: 'docker-compose.yml',
            env: {}
        },
        prod: {
            type: 'swarm',
            tag: 'guth_prod',
            file: 'docker-compose.yml',
            env: {}
        }
    }
}
