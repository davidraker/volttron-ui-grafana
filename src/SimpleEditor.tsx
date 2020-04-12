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

  onTokenChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, api_token: target.value });
  };

  onPlatformChanged = (sel: SelectableValue<string>) => {
    if (typeof sel.value === 'undefined') {
      this.props.onOptionsChange({ ...this.props.options, platform: '' });
    } else if (sel.value !== this.props.options.platform) {
      this.props.onOptionsChange({ ...this.props.options, platform: sel.value });
      this.getDevices(sel.value);
    }
  };

  onDeviceChanged = (sel: SelectableValue<string>) => {
    if (typeof sel.value === 'undefined') {
      this.props.onOptionsChange({ ...this.props.options, device: '' });
    } else if (sel.value !== this.props.options.device) {
      this.props.onOptionsChange({ ...this.props.options, device: sel.value });
      this.getPoints(sel.value);
    }
  };

  onPointChanged = (sel: SelectableValue<string>) => {
    if (typeof sel.value === 'undefined') {
      this.props.onOptionsChange({ ...this.props.options, point: '' });
    } else if (sel.value !== this.props.options.point) {
      this.props.onOptionsChange({ ...this.props.options, point: sel.value });
    }
  };

  prepareRequest = (type: string, endpoint: string, body: any) => {
    var request = new XMLHttpRequest();

    request.open(type, this.props.options.web_address + endpoint, true);
    if (request) {
      if (body) {
        request.setRequestHeader('Content-Type', 'application/json');
      }
      request.setRequestHeader('Authorization', 'Basic ' + this.props.options.api_token);
      return request;
    } else {
      alert('Failed to create request');
      return undefined;
    }
  };

  testAddress = () => {
    var myObj = this;
    var body = {
      method: 'get_platforms',
      params: [],
    };
    var request = this.prepareRequest('POST', '/drivers', body);
    if (request) {
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          alert('Connection test successful.');
        } else {
          alert('Failed to connect to ' + myObj.props.options.web_address + '.');
        }
      };
      request.onerror = function() {
        alert('An error while making the request.');
      };
      request.send(JSON.stringify(body));
    }
  };

  getToken = () => {
    var myObj = this;
    var body = {
      username: this.props.options.username,
      password: this.props.options.password,
    };
    var request = this.prepareRequest('POST', '/auth', body);

    if (request) {
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          var jobj = JSON.parse(this.response);

          myObj.props.onOptionsChange({ ...myObj.props.options, api_token: jobj.token });
        } else {
          alert('Failed to retrieve API Token');
        }
      };
      request.onerror = function() {
        alert('An error occured when retrieving API Token.');
      };
      request.send(JSON.stringify(body));
    }
  };

  getPlatforms = () => {
    var myObj = this;
    var body = {
      method: 'get_platforms',
      params: [],
    };
    var request = this.prepareRequest('POST', '/drivers', body);

    if (request) {
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          var jobj = JSON.parse(this.response);

          myObj.props.onOptionsChange({ ...myObj.props.options, platforms: jobj.results });
        } else {
          alert('Failed to retrieve platforms.');
          myObj.props.onOptionsChange({ ...myObj.props.options, platforms: [] });
        }
      };
      request.onerror = function() {
        alert('An error occured when retrieving platforms.');
        myObj.props.onOptionsChange({ ...myObj.props.options, platforms: [] });
      };
      request.send(JSON.stringify(body));
    }
  };

  getDevices = (plat: string) => {
    var myObj = this;
    var body = {
      method: 'get_devices',
      params: {
        platform: plat,
      },
    };
    var request = this.prepareRequest('POST', '/drivers', body);

    if (request) {
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          var jobj = JSON.parse(this.response);

          myObj.props.onOptionsChange({ ...myObj.props.options, devices: jobj.results });
        } else {
          alert('Failed to retrieve devices.');
          myObj.props.onOptionsChange({ ...myObj.props.options, platforms: [] });
        }
      };
      request.onerror = function() {
        alert('An error occured when retrieving devices.');
        myObj.props.onOptionsChange({ ...myObj.props.options, platforms: [] });
      };
      request.send(JSON.stringify(body));
    }
  };

  getPoints = (dev: string) => {
    var myObj = this;
    var body = {
      method: 'get_points',
      params: {
        platform: this.props.options.platform,
        device: dev,
      },
    };
    var request = this.prepareRequest('POST', '/drivers', body);

    if (request) {
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          var jobj = JSON.parse(this.response);

          myObj.props.onOptionsChange({ ...myObj.props.options, points: jobj.results });
        } else {
          alert('Failed to retrieve points.');
          myObj.props.onOptionsChange({ ...myObj.props.options, platforms: [] });
        }
      };

      request.onerror = function() {
        alert('An error occured when retrieving points.');
        myObj.props.onOptionsChange({ ...myObj.props.options, platforms: [] });
      };

      request.send(JSON.stringify(body));
    }
  };

  setPlatform = () => {
    const { options } = this.props;
    var iVal = options.platform;

    if (iVal !== '' && !options.platforms.includes(iVal)) {
      this.props.onOptionsChange({ ...this.props.options, platform: '' });
    }

    const sel: SelectableValue<string> = {
      value: options.platforms.includes(iVal) ? iVal : undefined,
      label: options.platforms.includes(iVal) ? iVal : 'Select platform...',
    };
    return sel;
  };

  setDevice = () => {
    const { options } = this.props;
    var iVal = options.device;

    if (iVal !== '' && !options.devices.includes(iVal)) {
      this.props.onOptionsChange({ ...this.props.options, device: '' });
    }

    const sel: SelectableValue<string> = {
      value: options.devices.includes(iVal) ? iVal : undefined,
      label: options.devices.includes(iVal) ? iVal : 'Select device...',
    };
    return sel;
  };

  setPoint = () => {
    const { options } = this.props;
    var iVal = options.point;

    if (iVal !== '' && !options.points.includes(iVal)) {
      this.props.onOptionsChange({ ...this.props.options, point: '' });
    }

    const sel: SelectableValue<string> = {
      value: options.points.includes(iVal) ? iVal : undefined,
      label: options.points.includes(iVal) ? iVal : 'Select point...',
    };
    return sel;
  };

  setDeviceOptions = () => {
    const { options } = this.props;
    if (options.platform === '' && options.devices.length !== 0) {
      this.props.onOptionsChange({ ...this.props.options, devices: [] });
      return undefined;
    }

    return this.props.options.devices.map<SelectableValue<string>>(name => ({
      value: name,
      label: name,
    }));
  };

  setPointOptions = () => {
    const { options } = this.props;
    if (options.device === '' && options.points.length !== 0) {
      this.props.onOptionsChange({ ...this.props.options, points: [] });
      return undefined;
    }

    return this.props.options.points.map<SelectableValue<string>>(name => ({
      value: name,
      label: name,
    }));
  };

  render() {
    const { options } = this.props;

    return (
      <div>
        <div className="section gf-form-group">
          <h5 className="section-heading">Volttron Settings</h5>
          <FormField
            label="Web Address"
            labelWidth={11}
            inputWidth={22}
            type="text"
            onChange={this.onAddressChanged}
            value={options.web_address || ''}
          />
          <FormField label="Username" labelWidth={11} inputWidth={22} type="text" onChange={this.onUsernameChanged} value={options.username || ''} />
          <FormField label="Password" labelWidth={11} inputWidth={22} type="text" onChange={this.onPasswordChanged} value={options.password || ''} />
          <FormField label="API Token" labelWidth={11} inputWidth={22} type="text" onChange={this.onTokenChanged} value={options.api_token || ''} />
          <div>
            <Button onClick={this.testAddress} children={'Test Connection'} />
            <b> </b>
            <Button onClick={this.getToken} children={'Retrieve API Token'} />
          </div>
        </div>
        <div className="section gf-form-group">
          <h5 className="section-heading">Device Settings</h5>
          <div className="form-field">
            <FormLabel width={11}>Platform</FormLabel>
            <Select
              onChange={this.onPlatformChanged}
              options={options.platforms.map<SelectableValue<string>>(name => ({
                value: name,
                label: name,
              }))}
              width={22}
              value={this.setPlatform()}
            />
          </div>
          <div className="form-field">
            <FormLabel width={11}>Device</FormLabel>
            <Select onChange={this.onDeviceChanged} options={this.setDeviceOptions()} width={22} value={this.setDevice()} />
          </div>
          <div className="form-field">
            <FormLabel width={11}>Point</FormLabel>
            <Select onChange={this.onPointChanged} options={this.setPointOptions()} width={22} value={this.setPoint()} />
          </div>
          <Button type="button" onClick={this.getPlatforms} children={'Retrieve Data'} />
        </div>
      </div>
    );
  }
}
