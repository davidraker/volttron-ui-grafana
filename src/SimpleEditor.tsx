import React, { PureComponent } from 'react';
import { FormField, FormLabel, Select, Button } from '@grafana/ui';
import { PanelEditorProps, SelectableValue } from '@grafana/data';

import { SimpleOptions } from './types';

export class SimpleEditor extends PureComponent<PanelEditorProps<SimpleOptions>> {
  onAddressChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, web_address: target.value });
  };

  onUsernameChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, username: target.value });
  };

  onPasswordChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, password: target.value });
  };

  onPlatformChanged = (sel: SelectableValue<string>) => {
    if (typeof sel.value !== 'undefined') {
      this.props.onOptionsChange({ ...this.props.options, platform: sel.value });
      this.getDevices(sel.value);
    } else {
      this.props.onOptionsChange({ ...this.props.options, platform: '' });
    }
  };

  onDeviceChanged = (sel: SelectableValue<string>) => {
    if (typeof sel.value !== 'undefined') {
      this.props.onOptionsChange({ ...this.props.options, device: sel.value });
      this.getPoints(sel.value);
    } else {
      this.props.onOptionsChange({ ...this.props.options, device: '' });
    }
  };

  onPointChanged = (sel: SelectableValue<string>) => {
    if (typeof sel.value !== 'undefined') {
      this.props.onOptionsChange({ ...this.props.options, point: sel.value });
    } else {
      this.props.onOptionsChange({ ...this.props.options, point: '' });
    }
  };

  testAddress = () => {
    var myObj = this;

    function createCORSRequest(method: string, url: string) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      return xhr;
    }

    var body = {
      method: 'get_platforms',
      params: [],
    };
    console.log(body);

    var request = createCORSRequest('POST', this.props.options.web_address + '/drivers');
    if (request) {
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          alert('Connection test successful');
        } else {
          alert('Failed to connect to ' + myObj.props.options.web_address);
        }
      };
      request.onerror = function() {
        alert('An error while making the request.');
      };
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify(body));
    }
  };

  getPlatforms = () => {
    var request = new XMLHttpRequest();
    var myObj = this;
    var body = {
      method: 'get_platforms',
      params: [],
    };

    request.open('POST', this.props.options.web_address + '/drivers', true);
    if (request) {
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          var jobj = JSON.parse(this.response);

          myObj.props.options.platforms = jobj.results;
          myObj.props.options.device = '';
          myObj.props.options.point = '';
          myObj.forceUpdate();
        } else {
          alert('Failed to retrieve platforms');
        }
      };
      request.onerror = function() {
        console.log('An error occured when retrieving platforms.');
      };
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify(body));
    } else {
      console.log('Failed to retrieve platforms (request failed).');
    }
  };

  getDevices = (plat: string) => {
    var request = new XMLHttpRequest();
    var myObj = this;
    var body = {
      method: 'get_devices',
      params: {
        platform: plat,
      },
    };

    request.open('POST', this.props.options.web_address + '/drivers', true);
    if (request) {
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          var jobj = JSON.parse(this.response);

          myObj.props.options.devices = jobj.results;
          myObj.props.options.device = '';
          myObj.props.options.point = '';
          myObj.forceUpdate();
        } else {
          console.log('Failed to retrieve devices.');
        }
      };
      request.onerror = function() {
        console.log('An error occured when retrieving devices.');
      };
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify(body));
    } else {
      console.log('Failed to retrieve devices (request failed).');
    }
  };

  getPoints = (dev: string) => {
    var request = new XMLHttpRequest();
    var myObj = this;
    var body = {
      method: 'get_points',
      params: {
        platform: this.props.options.platform,
        device: dev,
      },
    };

    request.open('POST', this.props.options.web_address + '/drivers', true);
    if (request) {
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          var jobj = JSON.parse(this.response);

          myObj.props.options.points = jobj.results;
          myObj.props.options.point = '';
          myObj.forceUpdate();
        } else {
          console.log('Failed to retrieve points.');
        }
      };
      request.onerror = function() {
        console.log('An error occured when retrieving points.');
      };
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify(body));
    } else {
      console.log('Failed to retrieve points (request failed).');
    }
  };

  setDevice = () => {
    console.log('Setting device');
    const { options } = this.props;
    if (options.devices.includes(options.device)) {
      const sel: SelectableValue<string> = {
        value: options.device,
        label: options.device,
      };
      console.log('Device in devices');
      return sel;
    }
    console.log('Device NOT in devices');
    return undefined;
  };

  setPoint = () => {
    const { options } = this.props;
    if (options.points.includes(options.point)) {
      const sel: SelectableValue<string> = {
        value: options.point,
        label: options.point,
      };
      return sel;
    }
    return undefined;
  };

  render() {
    const { options } = this.props;

    return (
      <div>
        <div className="section gf-form-group">
          <h5 className="section-heading">Volttron Settings</h5>
          <FormField
            label="Web Address"
            labelWidth={12}
            inputWidth={20}
            type="text"
            onChange={this.onAddressChanged}
            value={options.web_address || ''}
          />
          <FormField label="Username" labelWidth={12} inputWidth={20} type="text" onChange={this.onUsernameChanged} value={options.username || ''} />
          <FormField label="Password" labelWidth={12} inputWidth={20} type="text" onChange={this.onPasswordChanged} value={options.password || ''} />
          <Button onClick={this.testAddress} children={'Test Connection'} />
        </div>
        <div className="section gf-form-group">
          <h5 className="section-heading">Device Settings</h5>
          <div className="form-field">
            <FormLabel width={12}>Platform</FormLabel>
            <Select
              onChange={this.onPlatformChanged}
              options={options.platforms.map<SelectableValue<string>>(name => ({
                value: name,
                label: name,
              }))}
              width={20}
            />
          </div>
          <div className="form-field">
            <FormLabel width={12}>Device</FormLabel>
            <Select
              onChange={this.onDeviceChanged}
              options={options.devices.map<SelectableValue<string>>(name => ({
                value: name,
                label: name,
              }))}
              width={20}
              value={this.setDevice()}
            />
          </div>
          <div className="form-field">
            <FormLabel width={12}>Point</FormLabel>
            <Select
              onChange={this.onPointChanged}
              options={options.points.map<SelectableValue<string>>(name => ({
                value: name,
                label: name,
              }))}
              width={20}
              value={this.setPoint()}
            />
          </div>
          <Button type="button" onClick={this.getPlatforms} children={'Retrieve Data'} />
        </div>
      </div>
    );
  }
}
