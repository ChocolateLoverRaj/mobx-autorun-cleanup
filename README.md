> [!WARNING]  
> I no longer use or maintain this library. I don't really code in JavaScript anymore (I switched to Rust). If you want to maintain or fork it let me know (you can email me) and I can put the link here.

# mobx-autorun-cleanup
Mobx autorun function with cleanup callback

![Created with ](https://img.shields.io/badge/Created%20with-@programmerraj/create-3cb371?style=flat)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)

## Inspired By
This is very similar to the React [`useEffect`](https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup) hook.
      
## Example
```js
import autorunCleanup from 'mobx-autorun-cleanup'
import { observable } from 'mobx'

const obj = observable({ theme: 'light' })

const stop = autorunCleanup(() => {
  const currentTheme = obj.theme
  console.log('Load', currentTheme)
  return () => {
    console.log('Unload', currentTheme)
  }
})
// Logs: Load light

obj.theme = 'dark'
// Logs:
// Unload light
// Load dark

// If you want
stop()
// Logs: Unload dark
```

## Differences with `mobx` built-in [`reaction`](https://mobx.js.org/reactions.html#reaction)
`mobx-autorun-cleanup` is actually very similar to `reaction`, which is part of `mobx`.

Feature | `reaction` | `mobx-autorun-cleanup`
--- | --- | ---
Fn gets called first time | ❌ | ✔️
Fn is called after reactions | ✔️ | ✔️
Cleanup after reactions | ✔️ | ✔️
Cleanup after stopped | ❌ | ✔️
Cleanup is optional | ✔️ | ✔️
Separated code for reactions and side effects | ✔️ | ❌

Here is the same example, but it uses `reaction` instead of `mobx-autorun-cleanup`:
```js
import { observable, reaction } from 'mobx'

const obj = observable({ theme: 'light' })

console.log('Load', obj.theme)
// Logs: Load light

const stop = reaction(() => obj.theme, (currentTheme, previousTheme) => {
  console.log('Unload', previousTheme)
  console.log('Load', currentTheme)
})
// Nothing is called until `obj.theme` is changed

obj.theme = 'dark'
// Logs:
// Unload light
// Load dark

// If you want
stop()
// Nothing is logged, because there is no cleanup fn
// You can now specify to unload
console.log('Unload', obj.theme)
// Logs: Unload dark
```

### How to choose between the two
One way to think about the lifetime of the function and cleanup function is like a sandwich:

- The first bread is when the function gets initially called
- The stuff inside is when the function gets re-run after a reaction
- The last bread is when the reaction is stopped

`reaction` only calls the function in the middle of the sandwich. `mobx-autorun-cleanup` additionally calls the function initially, and calls the cleanup function in the end.

Based on this comparison, you can decide which function to use. I think generally `reaction` is for *side effects*, and `mobx-autorun-cleanup` is for *cleanup*.

## Typedoc
https://chocolateloverraj.github.io/mobx-autorun-cleanup
