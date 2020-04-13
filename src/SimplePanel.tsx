import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

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
    if (options.showPath) {
      this.props.options.tooltip = 'Path:/'.concat(this.props.options.platform, '/', this.props.options.device, '/', this.props.options.point);
    } else {
      this.props.options.tooltip = 'Path:Hidden';
    }
    return (
      <div
        style={{
          position: 'relative',
          width,
          height,
        }}
      >
        <div>
          <h2>{options.title}</h2>
          <Tooltip title={options.tooltip}>
            <input type="text" ng-change={this.onInputChanged} />
          </Tooltip>
          <Tooltip title={options.tooltip}>
            <Button variant="contained" onClick={this.updatePoint}>
              Update
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  }
}
