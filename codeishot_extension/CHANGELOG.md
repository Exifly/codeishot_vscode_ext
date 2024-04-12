# v0.5.6
## Fixes:
- The default authentication settings is now configured as **True**
## What's Changed
* fix: Configured the Auth settings to true when logged correctly by @gdjohn4s in https://github.com/Exifly/codeishot_vscode_ext/pull/6

# v0.5.0

## Features:
- Implemented Codeishot authentication feature.
  - Created a global Axios instance.
  - Utilized Axios interceptor for toggling between authenticated and unauthenticated APIs.
  - Introduced new data types.
  - Developed custom response and error handling for Axios.
  - Added login methods for authentication.
  - Established services utilizing the newly configured Axios instance.
  - Integrated URI handler to capture token parameters from the URI string.
  - Updated workspace configuration to store tokens for specific users instead of projects.
  - Implemented a function to launch an external browser for authentication.

## Fixes and Refactoring:
- Documented complex functions for better understanding.
- Documented all files within the project.
- Included license information in the entry point file.
- Removed redundant code to improve codebase cleanliness.

## What's Changed
* fix: added logo on marketplace by @gdjohn4s in https://github.com/Exifly/codeishot_vscode_ext/pull/1
* feat: added snippet authentication by @gdjohn4s in https://github.com/Exifly/codeishot_vscode_ext/pull/3
* feat: created uri handler by @gdjohn4s in https://github.com/Exifly/codeishot_vscode_ext/pull/4
* fix: refactored whole extension by @gdjohn4s in https://github.com/Exifly/codeishot_vscode_ext/pull/5

## New Contributors
* @gdjohn4s made their first contribution in https://github.com/Exifly/codeishot_vscode_ext/pull/1

# v0.1.0

- Initial release
