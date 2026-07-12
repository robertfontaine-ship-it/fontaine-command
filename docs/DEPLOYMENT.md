# Fontaine Command Deployment

Fontaine Command is deployed as a static site through GitHub Pages.

## Live address

After GitHub Pages is enabled with **GitHub Actions** as the source, the site address will be:

`https://robertfontaine-ship-it.github.io/fontaine-command/`

## Automatic publishing

The workflow in `.github/workflows/deploy-pages.yml` runs whenever a commit is pushed to `main`.

It can also be started manually from **Actions > Deploy Fontaine Command to GitHub Pages > Run workflow**.

## One-time repository setting

In the GitHub repository:

1. Open **Settings**.
2. Select **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

After that one-time setting, future commits to `main` publish automatically.

## Data behavior

The current application stores lesson notes, generated content, reflections, task completion, Canvas packages, and preferences in the browser's local storage. That data remains on the specific browser and device where it was entered. Deploying a new version does not intentionally erase it unless the storage schema changes or the user selects the reset control.

## Future production upgrade

A later backend release should replace browser-only storage with authenticated cloud storage so the same curriculum data is available across devices.
