import React from 'react';
import assign from 'object-assign';
import getDisplayName from 'react-display-name';

export default function validateComponent(validate) {
  return (Component) => {
    class ValidatedComponent extends React.Component {
      constructor(props) {
        super(props);
        this.validateProps(props);
      }

      componentWillUpdate(nextProps) {
        this.validateProps(nextProps);
      }

      validateProps(props) {
        this.errors = validate(props);
      }

      render() {
        const finalProps = assign({}, this.props, { errors: this.errors });
        return <Component {...finalProps} />;
      }
    }

    const componentName = getDisplayName(Component);

    ValidatedComponent.displayName = `ValidatedComponent(${componentName})`;

    return ValidatedComponent;
  };
}
