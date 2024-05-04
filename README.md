# DenoDeps
Export a list of your Deno dependencies with author and licensing info.

### Disclaimer
*__Always check the results manually. Do do not guarantee that the results of the dependency analysis are correct.__*

## Usage
```bash
# A read only API token is required for Github in order to have a higher API quota.
GITHUB_TOKEN="token" deno run -A jsr:@nihility-io/deno-deps --entrypoint main.ts --output deps.json
```

## Example Output
```json
[
  {
    "registry": "jsr",
    "name": "@nihility-io/flowbite-icons-preact",
    "version": "0.1.1",
    "authors": [
      "Nihility.io"
    ],
    "license": "MIT License",
    "repository": "https://github.com/Nihility-io/FlowbiteIconsPreact",
    "licenseFile": "https://raw.githubusercontent.com/Nihility-io/FlowbiteIconsPreact/main/LICENSE"
  },
  {
    "registry": "jsr",
    "name": "@nihility-io/fresh-lang",
    "version": "0.1.2",
    "authors": [
      "Nihility.io"
    ],
    "license": "MIT License",
    "repository": "https://github.com/Nihility-io/FreshLang",
    "licenseFile": "https://raw.githubusercontent.com/Nihility-io/FreshLang/main/LICENSE"
  },
  {
    "registry": "jsr",
    "name": "@nihility-io/record",
    "version": "0.1.1",
    "authors": [
      "Nihility.io"
    ],
    "license": "MIT License",
    "repository": "https://github.com/Nihility-io/Record",
    "licenseFile": "https://raw.githubusercontent.com/Nihility-io/Record/main/LICENSE"
  },
  {
    "registry": "jsr",
    "name": "@nihility-io/result",
    "version": "0.1.2",
    "authors": [
      "Nihility.io"
    ],
    "license": "MIT License",
    "repository": "https://github.com/Nihility-io/Result",
    "licenseFile": "https://raw.githubusercontent.com/Nihility-io/Result/main/LICENSE"
  },
  {
    "registry": "jsr",
    "name": "@nihility-io/use-cookie",
    "version": "0.1.3",
    "authors": [
      "Nihility.io"
    ],
    "license": "MIT License",
    "repository": "https://github.com/Nihility-io/UseCookie",
    "licenseFile": "https://raw.githubusercontent.com/Nihility-io/UseCookie/main/LICENSE"
  },
]
```