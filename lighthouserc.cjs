module.exports = {
    ci: {
      collect: {
        url: ['http://localhost:5174/'],
        startServerCommand: 'npm run dev'
      },
      upload: {
        target: 'temporary-public-storage'
      },
    //   assert: {
    //     assertions: {
    //       'categories:performance': ['error', { minscore: 0.9 }],
    //       'categories:accessibility': ['error', { minscore: 0.9 }],
    //       'categories:best-practices': ['error', { minscore: 0.9 }],
    //       'categories:seo': ['error', { minscore: 0.9 }]
    //     }
    //   },
    }
  };