import changelogPath from './CHANGELOG.md';

const changelog = (
  fetch(changelogPath)
  .then(res => res.text())
);

export { changelog };
