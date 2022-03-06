module.exports = (api) => {
    api.cache(true)
    return {
      "env": {
        "development": {
          "plugins": [["styled-components", { "ssr": true }]]
        }
      },
      presets: ["next/babel"]
    }
  }

