# react-revalidate

[![Travis branch](https://img.shields.io/travis/jfairbank/react-revalidate/master.svg?style=flat-square)](https://travis-ci.org/jfairbank/react-revalidate)
[![npm](https://img.shields.io/npm/v/react-revalidate.svg?style=flat-square)](https://www.npmjs.com/package/react-revalidate)

Validate React components with
[revalidate](https://github.com/jfairbank/revalidate).

React-revalidate makes integrating your React components with revalidate
simpler. The API is still a WIP, but for now react-revalidate exports a HOC
(higher order component) that validates a component's props according to
validate function generated from revalidate.

## Install

    $ npm install --save react-revalidate

## Usage

Use the `validateComponent` function to create a new component that validates
its own props. `validateComponent` is a curried function that takes a validate
function as the first argument and an optional options object as the second
argument. The returned function then takes your component as the only argument.
The wrapped component has a new prop called `errors` that contains any prop
validation errors.

```jsx
// ES2015 imports
import React from 'react';
import { validateComponent } from 'react-revalidate';

import {
  combineValidators,
  composeValidators,
  isAlphabetic,
  isNumeric,
  isRequired,
} from 'revalidate';

// CJS imports
const React = require('react');
const validateComponent = require('react-revalidate').validateComponent;
const r = require('revalidate');

const combineValidators = r.combineValidators;
const composeValidators = r.composeValidators;
const isAlphabetic = r.isAlphabetic;
const isNumeric = r.isNumeric;
const isRequired = r.isRequired;

// Usage
function NameTag({ name, age, errors, onUpdateName, onUpdateAge }) {
  return (
    <form>
      <div>
        <input type="text" value={name} onChange={onUpdateName} />
        {errors.name && <div>{errors.name}</div>}
      </div>

      <div>
        <input type="text" value={age} onChange={onUpdateAge} />
        {errors.age && <div>{errors.age}</div>}
      </div>
    </form>
  );
}

const validate = combineValidators({
  name: isRequired('Name'),

  age: composeValidators(
    isRequired,
    isNumeric
  )('Age'),
});

const WrappedNameTag = validateComponent(validate)(NameTag);

// ES2015 export
export default WrappedNameTag;

// CJS export
module.exports = WrappedNameTag;
```

### Missing `name` prop:

```jsx
render((
  <WrappedNameTag
    age="10"
    onUpdateName={onUpdateName}
    onUpdateAge={onUpdateAge}
  />
), document.getElementById('main'));
```

<img src="https://raw.githubusercontent.com/jfairbank/react-revalidate/master/images/form-name-required.png" width="500" alt="Name Required">

---

### Missing `age` prop:

```jsx
render((
  <WrappedNameTag
    name="Tucker"
    onUpdateName={onUpdateName}
    onUpdateAge={onUpdateAge}
  />
), document.getElementById('main'));
```

<img src="https://raw.githubusercontent.com/jfairbank/react-revalidate/master/images/form-age-required.png" width="500" alt="Age Required">

---

### Invalid `age` prop:

```jsx
render((
  <WrappedNameTag
    name="Tucker"
    age="abc"
    onUpdateName={onUpdateName}
    onUpdateAge={onUpdateAge}
  />
), document.getElementById('main'));
```

<img src="https://raw.githubusercontent.com/jfairbank/react-revalidate/master/images/form-age-numeric.png" width="500" alt="Age Invalid">

---

### Missing both props:

```jsx
render((
  <WrappedNameTag
    onUpdateName={onUpdateName}
    onUpdateAge={onUpdateAge}
  />
), document.getElementById('main'));
```

<img src="https://raw.githubusercontent.com/jfairbank/react-revalidate/master/images/form-both-required.png" width="500" alt="Both Required">
