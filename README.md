# DenoDeps
Export a list of your Deno dependencies with author and licensing info. Note, only NPM and JSR dependencies are processed and license detection is only supported for Github repositories.

### Disclaimer
*__Always check the results manually. Do do not guarantee that the results of the dependency analysis are correct.__*

## Usage
Support output formats are: .json, .yml, .yaml, .toml.

You can run deno-deps using command line options
```bash
# A read only API token is required for Github in order to have a higher API quota.
DENO_DEPS_GITHUB_TOKEN="token" deno run -A jsr:@nihility-io/deno-deps --entrypoint main.ts --output deps.json
```
or you can configuration your `deno.json` as follows:
```json
{
  "name": "my-module",
  "version": "1.0.0",
  // ...
  "denoDeps": {
    "entrypoint": "main.ts",
    "output": "deps.json"
  }
}
```

```bash
# A read only API token is required for Github in order to have a higher API quota.
DENO_DEPS_GITHUB_TOKEN="token" deno run -A jsr:@nihility-io/deno-deps
```

In case you want to specify dependencies which are not picked up by deno-deps e.g. a font or icon library, you can add them manually via your `deno.json` as follows:
```json
{
  "name": "my-module",
  "version": "1.100",
  // ...
  "denoDeps": {
    "entrypoint": "main.ts",
    "output": "deps.json",
    "dependencies": [{
      "name": "heroicons",
      "repository": "https://github.com/tailwindlabs/heroicons",
      "version": "2.2.0",
      "authors": ["Tailwind Labs, Inc."],
      "license": "MIT License",
      "licenseFile": "https://raw.githubusercontent.com/tailwindlabs/heroicons/refs/heads/master/LICENSE"
    }]
  }
}
```

You can also choose to exclude dependencies from the output by using the following config:
```json
{
  "name": "my-module",
  "version": "1.100",
  // ...
  "denoDeps": {
    // ...
    "excludeDependencies": [
      "zod",
      "@std/*"
    ]
  }
}
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