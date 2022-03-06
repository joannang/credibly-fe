module.exports = {
    moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx'],
    testMatch: ['**/*.(test|spec).(ts|tsx)'],
    globals: {
        crypto: require('crypto'),
        'ts-jest': {
            tsconfig: 'jest.tsconfig.json',
            babelConfig: true,
        },
    },
    testEnvironment: 'jsdom',
    modulePathIgnorePatterns: [],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        'enzyme.js',
        '<rootDir>/pages/'
    ],
    setupFilesAfterEnv: ['<rootDir>/test/setupTest.js'],
    coverageReporters: ['text', 'cobertura'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/mocks.js',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    preset: 'ts-jest/presets/js-with-babel',
};
