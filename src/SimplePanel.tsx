import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { Tooltip, Button } from '@grafana/ui';

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
        <div>
          <h2>{options.title}</h2>
          <input type="text" ng-change={this.onInputChanged} />
          <Tooltip
            content={
              <div>
                {'Platform: '.concat(options.platform)}
                <div>{'Device: '.concat(options.device)}</div>
                <div>{'Point: '.concat(options.point)}</div>
              </div>
            }
          >
            <Button onClick={this.updatePoint} children={'Update'} />
          </Tooltip>
        </div>
      </div>
    );
  }
}
