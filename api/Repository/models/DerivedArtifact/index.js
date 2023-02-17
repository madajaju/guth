
class DerivedArtifact {
    static definition = {
        name: 'DerivedArtifact',
        description: 'Derived Artifacts are derived from artifacts.',
        extends: 'Artifact',
        associations: {
            parents: {
                type: 'Artifact',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
        },
    }
}

module.exports = DerivedArtifact;

