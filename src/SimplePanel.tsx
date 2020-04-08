import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';

interface Props extends PanelProps<SimpleOptions> {}

export class SimplePanel extends PureComponent<Props> {
  onInputChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, input: target.value });
  };

  updatePoint = () => {
    console.log('Update Point');
  };

  render() {
    const { options, width, height } = this.props;

    return (
      <div
        style={{
          position: 'relative',
          width,
          height,
        }}
      >
        <div>{'Platform: ' + options.platform}</div>
        <div>{'Device: ' + options.device}</div>
        <div>{'Point: ' + options.point}</div>
        <input type="text" ng-change={this.onInputChanged} />
        <button type="button" onClick={this.updatePoint}>
          Update
        </button>
      </div>
    );
  }
}
