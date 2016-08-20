import React, { PropTypes } from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import {
  combineValidators,
  composeValidators,
  isAlphabetic,
  isNumeric,
  isRequired,
} from 'revalidate';

import { validateComponent } from '../src';

function App({ dog, favoriteMeme }) {
  return (
    <div>
      <p>
        My dog {dog.name} is {dog.age} years old.
      </p>

      <p>
        My favorite meme is {favoriteMeme}
      </p>
    </div>
  );
}

App.propTypes = {
  dog: PropTypes.shape({
    name: PropTypes.string,
    age: PropTypes.string,
  }),

  favoriteHobby: PropTypes.string,
  favoriteMeme: PropTypes.string,
};

const validate = combineValidators({
  'favoriteMeme': isAlphabetic('Favorite Meme'),
  'favoriteHobby': isRequired('Favorite Hobby'),
  'dog.name': isRequired({ message: 'Required dog name' }),

  'dog.age': composeValidators(
    isRequired,
    isNumeric
  )('Dog Age'),
});

const WrappedApp = validateComponent(validate)(App);

const favoriteMeme = 'Doge';
const favoriteHobby = 'Programming';
const dog = { name: 'Tucker', age: '10' };

test('adds no errors for valid props', t => {
  const wrapper = shallow(
    <WrappedApp
      dog={dog}
      favoriteHobby={favoriteHobby}
      favoriteMeme={favoriteMeme}
    />
  );

  t.deepEqual(wrapper.prop('errors'), {
    dog: {},
  });
});

test('adds error for invalid shallow prop', t => {
  const wrapper = shallow(
    <WrappedApp
      dog={dog}
      favoriteHobby={favoriteHobby}
      favoriteMeme="123"
    />
  );

  t.deepEqual(wrapper.prop('errors'), {
    favoriteMeme: 'Favorite Meme must be alphabetic',
    dog: {},
  });
});

test('does not add an error for a missing prop that is not required', t => {
  const wrapper = shallow(
    <WrappedApp
      dog={dog}
      favoriteHobby={favoriteHobby}
    />
  );

  t.deepEqual(wrapper.prop('errors'), {
    dog: {},
  });
});

test('adds an error for a missing required prop', t => {
  const wrapper = shallow(
    <WrappedApp
      dog={dog}
    />
  );

  t.deepEqual(wrapper.prop('errors'), {
    favoriteHobby: 'Favorite Hobby is required',
    dog: {},
  });
});

test('adds an error for a missing required key of a prop', t => {
  const wrapper = shallow(
    <WrappedApp
      dog={{ age: dog.age }}
      favoriteHobby={favoriteHobby}
    />
  );

  t.deepEqual(wrapper.prop('errors'), {
    dog: {
      name: 'Required dog name',
    },
  });
});

test('adds an error for an invalid key of a prop', t => {
  const wrapper = shallow(
    <WrappedApp
      dog={{ name: dog.name, age: 'abc' }}
      favoriteHobby={favoriteHobby}
    />
  );

  t.deepEqual(wrapper.prop('errors'), {
    dog: {
      age: 'Dog Age must be numeric',
    },
  });
});

test('adds an error for all invalid props and keys of props', t => {
  const wrapper = shallow(
    <WrappedApp
      favoriteMeme="123"
    />
  );

  t.deepEqual(wrapper.prop('errors'), {
    favoriteMeme: 'Favorite Meme must be alphabetic',
    favoriteHobby: 'Favorite Hobby is required',

    dog: {
      name: 'Required dog name',
      age: 'Dog Age is required',
    },
  });
});
