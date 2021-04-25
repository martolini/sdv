module.exports = function (plop) {
  // plop generator code
  plop.setGenerator('component', {
    description: 'react component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'component name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'components/{{name}}/index.tsx',
        templateFile: 'plop-templates/component/index.tsx.hbs',
      },
    ],
  });
};
