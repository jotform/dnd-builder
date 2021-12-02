# Contributing to Jotform DND Builder

We'd love for you to contribute to our source code and to make Jotform DND Builder even better than it is today! Here are the guidelines we'd like you to follow:

+ [Issues and Bugs](#issues)
+ [Pull Requests](#pr)
+ [Code Guide](#code)
+ [License](#license)

## <a name="issues"></a>Issues and Bugs

### Where to Find Known Issues

We will be using [GitHub Issues](https://github.com/jotform/dnd-builder/issues) for our public bugs. We will keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn't already exist.

### Reporting New Issues

The best way to get your bug fixed is to provide a reduced test case. CodeSandbox provide a way to give live examples.


## <a name="pr"></a>Pull Requests

**Working on your first Pull Request?** You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

*Before* submitting a pull request, please make sure the following is done…

+ Search [GitHub](https://github.com/jotform/dnd-builder/pulls) for an open or closed Pull Request that relates to your submission. You don't want to duplicate effort.

+ Fork the repo and create your branch from `master`.
+ If you've added code that should be **tested**, add tests!
+ If you've changed APIs, update the documentation.
+ Ensure the test suite passes (`yarn test`).
+ Make sure your code lints (`yarn lint`) - we've done our best to make sure these rules match our internal linting guidelines.
+ Write visual tests for new features by adding them in the `stories` directory. Run storybooks (`yarn storybook`) and check out changes.


## <a name="code"></a>Code Guide

Our linter will catch most styling issues that may exist in your code.
You can check the status of your code styling by simply running: `yarn run lint`

However, there are still some styles that the linter cannot pick up.
### Code Conventions

* Use semicolons `;`
* Commas last `,`
* 2 spaces for indentation (no tabs)
* Prefer `'` over `"`
* 100 character line length
* Write "attractive" code

## <a name="license"></a>License

By contributing to Jotform DND Builder, you agree that your contributions will be licensed under its MIT license.
