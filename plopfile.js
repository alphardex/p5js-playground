module.exports = function(plop) {
  // create your generators here
  plop.setGenerator("scene", {
    description: "generate a p5.js scene",
    prompts: [
      { type: "input", name: "name", message: "scene name" },
      { type: "input", name: "nameUpper", message: "scene name (uppercase)" },
      { type: "input", name: "nameKecab", message: "scene name (kecab-case)" },
    ], // array of inquirer prompts
    actions: [
      {
        type: "add",
        path: "src/scenes/{{name}}.ts",
        templateFile: "src/templates/scene.hbs",
      },
      {
        type: "add",
        path: "src/views/{{nameUpper}}.vue",
        templateFile: "src/templates/view.hbs",
      },
    ], // array of actions
  });
};
