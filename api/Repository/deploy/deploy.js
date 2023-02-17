
module.exports = {
    name: '_g',
    contexts: {
        dev: {
            type: 'swarm',
            tag: '_g_dev',
            file: 'docker-compose.yml',
            env: {}
        },
        test: {
            type: 'swarm',
            tag: '_g_test',
            file: 'docker-compose.yml',
            env: {}
        },
        prod: {
            type: 'swarm',
            tag: '_g_prod',
            file: 'docker-compose.yml',
            env: {}
        }
    }
}
