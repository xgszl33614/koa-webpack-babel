import { foo } from './helper'
import { default as header } from './header'
var fooj = foo()
fooj.then(res => alert(res), res => console.log(res))

header('main')

// asi()

let arr = [1, 2, 3]
for(let value of arr) {
  console.log(value)
}
