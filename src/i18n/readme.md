# Localization

This folder contanis an implimntations of [Project Fluent](https://github.com/projectfluent/fluent.js)

## How to use

In your main file call the init fuction.

```ts
import { init } from './i18n';

init(path: string, options?: { hasGlobal?: boolean, fallback: Locale });
```

This function sets the file  path where Localization files are stored and additional options:

`hasGlobal`: if a `gobal.ftl` file in present in your Localization directory

`fallback`: deafalt language

### Translation

translation options

```ts
interface tOptions {
    key: string
    ns?: string
    ons?: string
    locale?: Locale | LocaleString
    args?: Record<string, FluentVariable>
}
```

#### Example

key: `command-name`,
namespace: `command`,
locale: fallback language

```ts
t({ key: 'command-name', ns: 'command' }
```

key: `count-reply`,
namespace: `count`,
locale: locale of the interaction
args: username and length

```ts
t({
    locale: interaction.locale,
    key: 'count-reply',
    ns: 'count',
    args: {
        'username': message.author.username,
        'length':length.toString(),
    }
})
```
