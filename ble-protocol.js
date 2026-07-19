/**
 * Ninebot D18 BLE Protocol Handler
 * Based on NootNooot/segway-ninebot-ble protocol documentation
 * Supports basic telemetry reading and speed control
 */

class NinebotBLEProtocol {
    constructor() {
        this.device = null;
        this.server = null;
        this.characteristic = null;
        this.isConnected = false;
        
        // Ninebot D18 BLE characteristics
        this.SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'; // Nordic UART Service
        this.RX_CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // RX
        this.TX_CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // TX
        
        // D18 specific parameters
        this.PARAM_SPEED = 0x74; // Max speed parameter
        this.PARAM_BATTERY = 0x61; // Battery level
        this.PARAM_DISTANCE = 0x65; // Total distance
        this.PARAM_TEMP = 0x71; // Temperature
        this.PARAM_CURRENT_SPEED = 0x56; // Current speed
        this.PARAM_MODE = 0x7C; // Ride mode
    }

    /**
     * Connect to Ninebot D18 scooter via BLE
     */
    async connect() {
        try {
            const options = {
                filters: [
                    { namePrefix: 'Ninebot' },
                    { namePrefix: 'ninebot' },
                    { namePrefix: 'D18' }
                ],
                optionalServices: [this.SERVICE_UUID]
            };

            this.device = await navigator.bluetooth.requestDevice(options);
            console.log('Device found:', this.device.name);

            this.device.addEventListener('gattserverdisconnected', () => this.onDisconnected());

            this.server = await this.device.gatt.connect();
            console.log('GATT Server connected');

            const service = await this.server.getPrimaryService(this.SERVICE_UUID);
            console.log('Service found');

            this.characteristic = await service.getCharacteristic(this.TX_CHARACTERISTIC);
            console.log('Characteristic found');

            this.isConnected = true;
            await this.characteristic.startNotifications();
            this.characteristic.addEventListener('characteristicvaluechanged', (event) => this.handleNotification(event));

            return true;
        } catch (error) {
            console.error('Connection error:', error);
            this.isConnected = false;
            throw error;
        }
    }

    /**
     * Disconnect from scooter
     */
    async disconnect() {
        try {
            if (this.device && this.device.gatt.connected) {
                this.device.gatt.disconnect();
                this.isConnected = false;
                console.log('Disconnected from scooter');
            }
        } catch (error) {
            console.error('Disconnect error:', error);
        }
    }

    /**
     * Handle incoming BLE notifications
     */
    handleNotification(event) {
        const value = event.target.value;
        const data = new Uint8Array(value.buffer);
        console.log('Received:', Array.from(data).map(x => x.toString(16)).join(' '));
    }

    /**
     * Handle disconnection
     */
    onDisconnected() {
        console.log('Scooter disconnected');
        this.isConnected = false;
    }

    /**
     * Send command to scooter
     * @param {Uint8Array} data - Command data
     */
    async sendCommand(data) {
        if (!this.isConnected || !this.characteristic) {
            throw new Error('Not connected to scooter');
        }

        try {
            const rxChar = await this.server.getPrimaryService(this.SERVICE_UUID)
                .then(service => service.getCharacteristic(this.RX_CHARACTERISTIC));
            
            await rxChar.writeValue(data);
            console.log('Command sent:', Array.from(data).map(x => x.toString(16)).join(' '));
        } catch (error) {
            console.error('Send error:', error);
            throw error;
        }
    }

    /**
     * Build parameter read command
     * @param {number} paramId - Parameter ID
     */
    buildReadCommand(paramId) {
        // Ninebot protocol: [CMD, PARAM_ID]
        const cmd = new Uint8Array(2);
        cmd[0] = 0x01; // Read command
        cmd[1] = paramId;
        return cmd;
    }

    /**
     * Build parameter write command
     * @param {number} paramId - Parameter ID
     * @param {Uint8Array} value - Value to write
     */
    buildWriteCommand(paramId, value) {
        const cmd = new Uint8Array(2 + value.length);
        cmd[0] = 0x02; // Write command
        cmd[1] = paramId;
        cmd.set(value, 2);
        return cmd;
    }

    /**
     * Read current battery level
     */
    async readBattery() {
        const cmd = this.buildReadCommand(this.PARAM_BATTERY);
        await this.sendCommand(cmd);
        // Response will come through notification handler
    }

    /**
     * Read current speed
     */
    async readCurrentSpeed() {
        const cmd = this.buildReadCommand(this.PARAM_CURRENT_SPEED);
        await this.sendCommand(cmd);
    }

    /**
     * Read maximum speed setting
     */
    async readMaxSpeed() {
        const cmd = this.buildReadCommand(this.PARAM_SPEED);
        await this.sendCommand(cmd);
    }

    /**
     * Read total distance traveled
     */
    async readDistance() {
        const cmd = this.buildReadCommand(this.PARAM_DISTANCE);
        await this.sendCommand(cmd);
    }

    /**
     * Read motor temperature
     */
    async readTemperature() {
        const cmd = this.buildReadCommand(this.PARAM_TEMP);
        await this.sendCommand(cmd);
    }

    /**
     * Set maximum speed limit
     * @param {number} speed - Speed in km/h (20-55)
     */
    async setMaxSpeed(speed) {
        if (speed < 20 || speed > 55) {
            throw new Error('Speed must be between 20 and 55 km/h');
        }

        // Speed is sent as value * 100 in the protocol
        const speedValue = new Uint8Array(2);
        const speedInt = Math.round(speed * 100);
        speedValue[0] = (speedInt >> 8) & 0xFF;
        speedValue[1] = speedInt & 0xFF;

        const cmd = this.buildWriteCommand(this.PARAM_SPEED, speedValue);
        await this.sendCommand(cmd);
    }

    /**
     * Toggle DRL (Daytime Running Light)
     * @param {boolean} enabled - Enable or disable
     */
    async setDRL(enabled) {
        const value = new Uint8Array(1);
        value[0] = enabled ? 0x01 : 0x00;
        
        // DRL parameter (example - verify with actual protocol)
        const cmd = this.buildWriteCommand(0xD3, value);
        await this.sendCommand(cmd);
    }

    /**
     * Set speaker volume
     * @param {number} volume - Volume 0-100
     */
    async setVolume(volume) {
        if (volume < 0 || volume > 100) {
            throw new Error('Volume must be between 0 and 100');
        }

        const value = new Uint8Array(1);
        value[0] = Math.round((volume / 100) * 255);

        // Volume parameter
        const cmd = this.buildWriteCommand(0xF5, value);
        await this.sendCommand(cmd);
    }

    /**
     * Read all telemetry
     */
    async readAllTelemetry() {
        try {
            await this.readBattery();
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.readCurrentSpeed();
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.readMaxSpeed();
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.readDistance();
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.readTemperature();
        } catch (error) {
            console.error('Telemetry read error:', error);
        }
    }

    /**
     * Parse telemetry response
     * @param {Uint8Array} data - Response data
     */
    parseTelemetry(data) {
        const telemetry = {};

        if (data.length < 2) {
            return telemetry;
        }

        const paramId = data[1];

        switch (paramId) {
            case this.PARAM_BATTERY:
                telemetry.battery = data[2];
                break;
            case this.PARAM_CURRENT_SPEED:
                telemetry.currentSpeed = (data[2] << 8 | data[3]) / 100;
                break;
            case this.PARAM_SPEED:
                telemetry.maxSpeed = (data[2] << 8 | data[3]) / 100;
                break;
            case this.PARAM_DISTANCE:
                telemetry.distance = (data[2] << 24 | data[3] << 16 | data[4] << 8 | data[5]) / 1000;
                break;
            case this.PARAM_TEMP:
                telemetry.temperature = data[2];
                break;
            case this.PARAM_MODE:
                const modes = ['Eco', 'Sport', 'Race', 'Walk'];
                telemetry.mode = modes[data[2]] || 'Unknown';
                break;
        }

        return telemetry;
    }
}

// Export for use in app.js
window.NinebotBLEProtocol = NinebotBLEProtocol;
