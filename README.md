# mobx-autorun-cleanup
Mobx autorun function with cleanup callback

![Created with ](https://img.shields.io/badge/Created%20with-@programmerraj/create-3cb371?style=flat)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)

## Similar Functions
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

## Typedoc
https://chocolateloverraj.github.io/mobx-autorun-cleanup