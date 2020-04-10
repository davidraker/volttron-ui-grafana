import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import Button from '@material-ui/core/Button';

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
        {options.showPath ? <div>{'Platform: ' + options.platform}</div> : null}
        {options.showPath ? <div>{'Device: ' + options.device}</div> : null}
        {options.showPath ? <div>{'Point: ' + options.point}</div> : null}
        <input type="text" ng-change={this.onInputChanged} />
        <Button variant="contained" onClick={this.updatePoint}>
          Update
        </Button>
      </div>
    );
  }
}

